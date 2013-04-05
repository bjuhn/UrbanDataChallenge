require 'json'
require 'csv'

class SFStops 

  def initialize stopsfile, route_id, buses = nil, csv = nil
    if csv.nil? or csv == false
      incoming_obj = JSON.parse File.read(stopsfile)
    else
      incoming_obj = csv_to_obj stopsfile, route_id
    end
    @obj = SFStops.filter_stops incoming_obj, route_id
    build_stops_by_code
  end

  def csv_to_obj filename, route_code
    puts 'begin: SFStops.csv_to_obj'
    out_obj = {
      "features" => []
    }

    CSV.foreach(filename,{:headers=>"first_row"}) do |line|
      out_obj['features'].push map_line(line)
    end
    puts 'end: SFStops.csv_to_obj'
    out_obj
  end

  def map_line line
    # csv format: 
    #   routecode,stopcode,tripdirection,long,lat
    # simulating:
    #   { "type": "Feature", "properties": { "networkCode": "reseau_2012", "stopCode": "RPRS01", "stopName": "Route de Presinge", "routeCode": "96", "routeDirection": "2", "routeDestination": "Malagnou" }, "geometry": { "type": "Point", "coordinates": [ 6.24738234295822, 46.226716624840797, 0.0 ] } }
    {
      "geometry" => { 
        "type" => "Point", 
        "coordinates" => [ line[3], line[4], 0.0 ] 
      },
      "properties" => {
        "stopCode" => line[1],
        "routeCode" => line[0],
        "routeDirection" => line[2]
      }
    }
  end


  def self.filter_stops incoming_obj, route_id
    puts "begin: SFStops.filter_stops"
    new_obj = []
    incoming_obj['features'].each{|feature|
      if (feature["properties"]["routeCode"] == route_id)
        new_obj.push feature
      end
    }
    puts "end: SFStops.filter_stops"
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
      @stops_by_code[feature['properties']['stopCode']] = feature
    }
  end

  def lookup_feature_by_stopcode stop_code, trip_direction
    lookup = @stops_by_code[stop_code]
    if lookup.nil?
      puts "%s is nil " % [stop_code]
    end
    lookup
  end

  def add_passenger_loads buses
    puts "begin: SFStops.add_passenger_loads"
    buses.get_buses.each{|bus|
      bus['runs'].each{ |run|
        add_load run['stopCode'], run['on'], run['depart_time'], run['tripDirection']
      }
    }
    sort_passenger_loads
    puts "end: SFStops.add_passenger_loads"
  end

  def add_load stop_code, on_count, depart_time, trip_direction
    stop = lookup_feature_by_stopcode stop_code, trip_direction
    return if stop.nil?
    stop['passengerLoads'] = [] if stop['passengerLoads'].nil?
    stop['passengerLoads'].push({'pickup_time' => depart_time, 'count' => on_count})
  end

  def sort_passenger_loads
    puts "begin: SFStops.sort_passenger_loads"
    @obj.each{|feature| 
      next if feature['passengerLoads'].nil?
      feature['passengerLoads'] = feature['passengerLoads'].sort_by{|load|
        load['pickup_time']
      }
    }
    puts "end: SFStops.sort_passenger_loads"
  end

  def to_json
     @obj.to_json
  end

end