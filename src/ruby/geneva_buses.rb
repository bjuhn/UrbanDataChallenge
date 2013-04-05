class GenevaBuses

  def initialize route_code, route, stops, stop_csv
    @obj = []
    @route_code = route_code

    load_bus_info stop_csv.get_route_stops(route_code)
    get_stop_lat_lngs stops
    sort_bus_runs
    add_to_stop_info
    get_segment_ids route
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

  def sort_bus_runs
    puts "begin: GenevaBuses.sort_bus_stops"
    @obj.each{|bus| 
      bus['runs'] = bus['runs'].sort_by{|run|
        run['depart_time']
      }
    }
    puts "end: GenevaBuses.sort_bus_stops"
  end

  def add_to_stop_info
    @obj.each{|bus| 
      to_stop = nil
      to_arrive_time = nil
      bus['runs'] = bus['runs'].reverse_each{|run|
        run['toStopCode'] = to_stop
        run['arrive_time'] = to_arrive_time
        to_stop = run['stopCode']
        to_arrive_time = run['depart_time']
      }
      bus['runs'].pop
    }
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
        stop = stops.lookup_feature_by_stopcode run["stopCode"], run["tripDirection"]
        run["coordinates"] = stop["geometry"]["coordinates"] if !stop.nil?
      }
    }
    puts "end: GenevaBuses.get_stop_lat_lngs"
  end

  def get_segment_ids route
    puts "begin: GenevaBuses.get_segment_ids"
    @obj.each{ |bus| 
      bus["runs"].each{|run|
        run["segment"], backwards = route.get_segment_idx_by_stops run['stopCode'], run['toStopCode']
        run["backwards"] = true if backwards == true
      }
    }
    puts "end: GenevaBuses.get_segment_ids"  
  end

end