require 'json'

class GenevaStops 

  def initialize stopsfile, route_id
    obj = JSON.parse File.read(stopsfile)
    @obj = GenevaStops.filter_stops obj, route_id
    build_stops_by_code
  end

  def self.filter_stops obj, route_id
    puts "begin: GenevaStops.filter_stops"
    new_obj = {}
    new_obj["type"] = "FeatureCollection"
    new_obj["features"] = []

    obj["features"].each{|feature|
      if (feature["properties"]["routeCode"] == route_id)
        new_obj["features"].push feature
      end
    }
    puts "end: GenevaStops.filter_stops"
    new_obj
  end

  def get_features
    @obj["features"]
  end

  def get_stops_by_code
    @stops_by_code
  end

  def build_stops_by_code
    @stops_by_code = {} 
    @obj["features"].each{|feature| 
      @stops_by_code[feature['properties']['stopCode']] = feature
    }
  end

  def lookup_feature_by_stopcode stop_code
    lookup = @stops_by_code[stop_code]
    if lookup.nil?
      puts "%s is nil " % [stop_code]
    end
    lookup
  end

end