require 'json'

class GenevaStops 

  def initialize stopsfile, route_id
    obj = JSON.parse File.read(stopsfile)
    @obj = GenevaStops.filter_stops obj, route_id
  end

  def self.filter_stops obj, route_id
    puts "begin: GenevaStops.filter_stops"
    new_obj = {}
    new_obj[:type] = "FeatureCollection"
    new_obj[:features] = []

    obj["features"].each{|feature|
      if (feature["properties"]["routeCode"] != route_id)
        new_obj[:features].push feature
      end
    }
    puts "end: GenevaStops.filter_stops"
    new_obj
  end

  def get_features
    @obj[:features]
  end

end