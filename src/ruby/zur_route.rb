require 'json'
require 'rgeo'

class ZurRoute

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

  def get_segment_idx_by_stops from_code, to_code
    # puts 'here'
    @obj['features'].each_with_index{ |feature, i|
      # puts 'here2'
      props = feature['properties']
      return nil if !props.has_key? 'FromStopID' or !props.has_key? 'ToStopID'
      
      if props["FromStopID"].to_s == from_code.to_s and props["ToStopID"].to_s == to_code.to_s
        puts "%s : %s : %s : %s" % [props["FromStopID"], from_code, to_code, props["ToStopID"]]
        return i, nil
      elsif props["toStopCode"].to_s == from_code.to_s and props["ToStopID"].to_s == to_code.to_s
        puts "%s : %s : %s : %s" % [props["FromStopID"], from_code, to_code, props["ToStopID"]]
        return i, true
      end
    }
    nil
  end

end