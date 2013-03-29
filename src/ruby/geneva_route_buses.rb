class GenevaRouteBuses

  def initialize route_code
    @obj = []
    @route_code = route_code
  end

  def load_bus_info line_stops
    puts "begin: GenevaRouteBuses.load_bus_info"
    line_stops.each{|stop|
      bus = get_bus stop[:tripId]
      run_info = {
        :depart_time => stop[:stopTimeReal],
        :arrive_time => nil,
        :load => stop[:passengerLoadStop],
        :segment => nil,
        :stopCode => stop[:stopCode],
        :tripDirection => stop[:tripDirection]
      }
      bus[:runs].push run_info
    }
    puts "end: GenevaRouteBuses.load_bus_info"
  end

  def get_bus bus_id
    @obj.each{ |bus|
      return bus if bus[:bus_id] == bus_id
    }

    new_bus = {:bus_id => bus_id, :route_id => @route_code, :runs => []}
    @obj.push new_bus
    new_bus
  end

  def to_json
     @obj.to_json
  end

  def get_stop_lat_lngs stops
    puts "begin: GenevaRouteBuses.get_stop_lat_lngs"
    # puts @obj
    @obj.each{ |bus| 
      bus[:runs].each{|run|
        stops.get_features.each{ |stop_feature|
          if run[:stopCode] == stop_feature['properties']['stopCode']
            run["coordinates"] = stop_feature["geometry"]["coordinates"]
          end
        }
      }
    }
    puts "end: GenevaRouteBuses.get_stop_lat_lngs"
  end

  def get_segment_ids route
    puts "begin: GenevaRouteBuses.get_segment_ids"
    @obj.each{ |bus| 
      bus[:runs].each{|run|
        i = 0
        route.get_features.each{ |feature|
          next if run['coordinates'].nil?
          first = feature['geometry']['coordinates'].first() 
          last = feature['geometry']['coordinates'].last()
          if run[:tripDirection] == 'A' and first[0] == run['coordinates'][0] and first[1] == run['coordinates'][1]
            run[:segment] = i
            break
          elsif run[:tripDirection] == 'R' and last[0] == run['coordinates'][0] and last[1] == run['coordinates'][1]
            run[:segment] = i
            break
          end
          i = i + 1
        }
      }
    }
    puts "end: GenevaRouteBuses.get_segment_ids"  
  end

  def fill_arrivals
    puts "begin: GenevaRouteBuses.fill_arrivals"
    @obj.each{ |bus| 
      arrive_time = nil
      bus[:runs].reverse_each{|run|
        run[:arrive_time] = arrive_time
        arrive_time = run[:depart_time]
      }
    }
    puts "end: GenevaRouteBuses.fill_arrivals"
  end

end