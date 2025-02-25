require 'json'
require 'rgeo'

class GenevaRoute

  def initialize str
    @obj = JSON.parse str
    add_distance
    multi_to_single_line
  end

  def add_features features
    @obj['features'].concat features
  end

  def get_features
    @obj['features']
  end

  def to_json
    @obj.to_json
  end

  def add_distance
    @obj['features'].each{ |feature|
      sum = calculate_distance feature['geometry']['coordinates']
      feature['distance'] = sum
    }
  end

  def add_stops stops
    delta = 0.00001
    stops.get_features.each{|stop|
      get_start_segments_by_coords(stop["geometry"]["coordinates"], delta).each{|segment|
        segment["properties"]["fromStopCode"] = stop["properties"]["stopCode"]
      }
      get_end_segments_by_coords(stop["geometry"]["coordinates"], delta).each{|segment|
        segment["properties"]["toStopCode"] = stop["properties"]["stopCode"]
      }
    }
  end

  def get_start_segments_by_coords coords, delta
    segments = []
    @obj['features'].each{ |feature|
      last = feature['geometry']['coordinates'].last()
      last = last.last() if last.last().kind_of?(Array)
      if (last[0] - coords[0]).abs < delta and (last[1] - coords[1]).abs < delta
        segments.push feature
      end
    }
    segments
  end

  def get_end_segments_by_coords coords, delta
    segments = []
    @obj['features'].each{ |feature|
      first = feature['geometry']['coordinates'].first()
      first = first.first() if first.first().kind_of?(Array)
      if (first[0] - coords[0]).abs < delta and (first[1] - coords[1]).abs < delta
        segments.push feature
      end
    }
    segments
  end

  def get_segment_idx_by_stops from_code, to_code
    @obj['features'].each_with_index{ |feature, i|
      if from_code == feature["properties"]["fromStopCode"] and to_code == feature["properties"]["toStopCode"]
        return i, true
      elsif from_code == feature["properties"]["toStopCode"] and to_code == feature["properties"]["fromStopCode"]
        return i, nil
      end
    }
    nil
  end

  def calculate_distance line_string
    if line_string.first().first().kind_of?(Array) 
      sum = 0
      line_string.each{ |line| 
        sum = sum + calculate_distance(line)
      }
      return sum
    else
      factory = RGeo::Geographic.spherical_factory
      points = line_string.map{ |coord|
        factory.point coord[0], coord[1]
      }    
      line = factory.line_string(points)
      return line.length
    end
  end

  def multi_to_single_line 
    @obj['features'].each{ |feature|
      if feature['geometry']['coordinates'].first().first().kind_of?(Array) 
        feature['geometry']['coordinates'] = feature['geometry']['coordinates'].flatten 1
        feature['geometry']['type'] = 'LineString'
      end
    }
  end

end