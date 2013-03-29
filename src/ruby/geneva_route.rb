require 'json'

class GenevaRoute

  def initialize str
    @obj = JSON.parse str
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

end