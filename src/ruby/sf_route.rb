require 'json'
require 'rgeo'

class SFRoute

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

  def add_stops stops
    delta = 0.001
    stops.get_features.each{|stop|
      get_start_segments_by_coords(stop["geometry"]["coordinates"], delta).each{|segment|
        segment["properties"]["fromStopCode"] = [] if !segment["properties"].has_key? "fromStopCode"
        segment["properties"]["fromStopCode"].push stop["properties"]["stopCode"]
      }
      get_end_segments_by_coords(stop["geometry"]["coordinates"], delta).each{|segment|
        segment["properties"]["toStopCode"] = [] if !segment["properties"].has_key? "toStopCode"
        segment["properties"]["toStopCode"].push stop["properties"]["stopCode"]
      }
    }

    @obj['features'].each{|feature|
      first = feature['geometry']['coordinates'].first()
      first = first.first() if first.first().kind_of?(Array)
      last = feature['geometry']['coordinates'].last()
      last = last.last() if last.last().kind_of?(Array)
      if !feature['properties'].has_key? 'toStopCode'
        puts "%s : %s" % [first, last]
        puts 'no tostopcode'
      end
      if !feature['properties'].has_key? 'fromStopCode'
        puts "%s : %s" % [first, last]
        puts 'no fromstopcode'
      end
    }
  end

  def get_start_segments_by_coords coords, delta
    segments = []
    @obj['features'].each{ |feature|
      last = feature['geometry']['coordinates'].last()
      last = last.last() if last.last().kind_of?(Array)
      if (last[0].to_f - coords[0].to_f).abs < delta and (last[1].to_f - coords[1].to_f).abs < delta
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
      if (first[0].to_f - coords[0].to_f).abs < delta and (first[1].to_f - coords[1].to_f).abs < delta
        segments.push feature
      end
    }
    segments
  end

  def get_segment_idx_by_stops from_code, to_code
    @obj['features'].each_with_index{ |feature, i|
      props = feature['properties']
      return nil if !props.has_key? 'fromStopCode' or !props.has_key? 'toStopCode'
      if feature["properties"]["fromStopCode"].include? from_code and feature["properties"]["toStopCode"].include? to_code
        return i, true
      elsif feature["properties"]["toStopCode"].include? from_code and feature["properties"]["fromStopCode"].include? to_code
        return i, nil
      end
    }
    nil
  end

end