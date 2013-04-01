require 'json'

class GenevaStops 

  def initialize stopsfile, route_id, buses = nil
    incoming_obj = JSON.parse File.read(stopsfile)
    @obj = GenevaStops.filter_stops incoming_obj, route_id
    build_stops_by_code
  end

  def self.filter_stops incoming_obj, route_id
    puts "begin: GenevaStops.filter_stops"
    new_obj = []
    incoming_obj['features'].each{|feature|
      if (feature["properties"]["routeCode"] == route_id)
        new_obj.push feature
      end
    }
    puts "end: GenevaStops.filter_stops"
    new_obj
  end

  def get_features
    @obj
  end

  def get_stops_by_code
    @stops_by_code
  end

  def build_stops_by_code
    @stops_by_code = {} 
    @obj.each{|feature| 
      @stops_by_code[feature['properties']['stopCode']+feature['properties']['routeDirection']] = feature
    }
  end

  def lookup_feature_by_stopcode stop_code, trip_direction
    route_direction = if trip_direction == 'A'
      "1"
    else
      "2"
    end

    lookup = @stops_by_code[stop_code+route_direction]
    if lookup.nil?
      puts "%s is nil " % [stop_code]
    end
    lookup
  end

  def add_passenger_loads buses
    puts "begin: GenevaStops.add_passenger_loads"
    buses.get_buses.each{|bus|
      bus['runs'].each{ |run|
        add_load run['stopCode'], run['on'], run['depart_time'], run['tripDirection']
      }
    }
    sort_passenger_loads
    puts "end: GenevaStops.add_passenger_loads"
  end

  def add_load stop_code, on_count, depart_time, trip_direction
    stop = lookup_feature_by_stopcode stop_code, trip_direction
    return if stop.nil?
    stop['passengerLoads'] = [] if stop['passengerLoads'].nil?
    stop['passengerLoads'].push({'pickup_time' => depart_time, 'count' => on_count})
  end

  def sort_passenger_loads
    puts "begin: GenevaStops.sort_passenger_loads"
    @obj.each{|feature| 
      next if feature['passengerLoads'].nil?
      feature['passengerLoads'] = feature['passengerLoads'].sort_by{|load|
        load['pickup_time']
      }
    }
    puts "end: GenevaStops.sort_passenger_loads"
  end

  def to_json
     @obj.to_json
  end

end