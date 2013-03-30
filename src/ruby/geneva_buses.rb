class GenevaBuses

  def initialize route_code, route, stops, stop_csv
    @obj = []
    @route_code = route_code

    load_bus_info stop_csv.get_route_stops(route_code)
    get_stop_lat_lngs stops
    get_segment_ids route
    fill_arrivals
  end

  def load_bus_info line_stops
    puts "begin: GenevaBuses.load_bus_info"
    line_stops.each{|stop|
      bus = get_bus stop["tripId"]
      run_info = {
        "depart_time" => stop["stopTimeReal"],
        "arrive_time" => nil,
        "load" => stop["passengerLoadStop"],
        "on" => stop["passengerCountStopUp"],
        "segment" => nil,
        "stopCode" => stop["stopCode"],
        "tripDirection" => stop["tripDirection"]
      }
      bus["runs"].push run_info
    }
    puts "end: GenevaBuses.load_bus_info"
  end

  def get_bus bus_id
    @obj.each{ |bus|
      return bus if bus["bus_id"] == bus_id
    }

    new_bus = {"bus_id" => bus_id, "route_id" => @route_code, "runs" => []}
    @obj.push new_bus
    new_bus
  end

  def get_buses
    @obj
  end

  def to_json
     @obj.to_json
  end

  def get_stop_lat_lngs stops
    puts "begin: GenevaBuses.get_stop_lat_lngs"
    # puts @obj
    @obj.each{ |bus| 
      bus["runs"].each{|run|
        stop = stops.lookup_feature_by_stopcode run["stopCode"]
        run["coordinates"] = stop["geometry"]["coordinates"] if !stop.nil?
      }
    }
    puts "end: GenevaBuses.get_stop_lat_lngs"
  end

  def get_segment_ids route
    puts "begin: GenevaBuses.get_segment_ids"
    @obj.each{ |bus| 
      bus["runs"].each{|run|
        i = 0
        route.get_features.each{ |feature|
          next if run['coordinates'].nil?
          delta = 0.000001
          first = feature['geometry']['coordinates'].first()
          first = first.first() if first.first().kind_of?(Array)
          last = feature['geometry']['coordinates'].last()
          last = last.last() if last.last().kind_of?(Array)
          coords = [run['coordinates'][0], run['coordinates'][1]]
          # puts "%s %s" % [first, coords]
          # puts feature
          if run["tripDirection"] == 'R' and (first[0] - coords[0]).abs < delta and (first[1] - coords[1]).abs < delta
            run["segment"] = i
            break
          elsif run["tripDirection"] == 'A' and (last[0] - coords[0]).abs < delta and (last[1] - coords[1]).abs < delta
            run["segment"] = i
            break
          end
          i = i + 1
        }
      }
    }
    puts "end: GenevaBuses.get_segment_ids"  
  end

  def fill_arrivals
    puts "begin: GenevaBuses.fill_arrivals"
    @obj.each{ |bus| 
      arrive_time = nil
      bus["runs"].reverse_each{|run|
        run["arrive_time"] = arrive_time
        arrive_time = run["depart_time"]
      }
    }
    puts "end: GenevaBuses.fill_arrivals"
  end

end