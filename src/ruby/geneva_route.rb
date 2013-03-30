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