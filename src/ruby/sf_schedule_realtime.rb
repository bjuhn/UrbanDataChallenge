class SFScheduleRealtime

  def initialize filename
    @lines = []
    @filename = filename
  end

  def get_route_stops route_code
    puts 'begin: SFScheduleRealtime.get_route_stops'

    tmp_filename = "/tmp/filter_schedule.csv"
    cmd = 'awk -F "\"*,\"*" \'{if($1==%s) print $0}\' %s > %s' % [route_code, @filename, tmp_filename]
    `#{cmd}`    
    route_stops = []
    CSV.foreach(tmp_filename,{:headers=>"first_row"}) do |line|
      route_stops.push map_line(line)
    end
    puts 'end: SFScheduleRealtime.get_route_stops'
    route_stops
  end

  def map_line line
    #csv format:
    # routecode,tripid,tripdirection,stopcode,stoptimereal,passengercountstopup,passengercountstopdown,stop_seq,minutes_since_last_bus
    {
      "routeCode" => line[0],
      "tripId" => line[1],
      "tripDirection" => line[2],
      "stopCode" => line[3],
      "stopTimeReal" => line[4],
      "passengerLoadStop" => line[5]
    }
  end

end