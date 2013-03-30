class GenevaScheduleRealtime

  def initialize filename
    @lines = []
    @filename = filename
  end

  def get_route_stops route_code
    puts 'begin: GenevaScheduleRealtime.get_route_stops'

    tmp_filename = "/tmp/filter_schedule.csv"
    cmd = 'awk -F "\"*,\"*" \'{if($2==%s) print $0}\' %s > %s' % [route_code, @filename, tmp_filename]
    `#{cmd}`    
    route_stops = []
    CSV.foreach(tmp_filename,{:headers=>"first_row"}) do |line|
      route_stops.push map_line(line)
    end
    puts 'end: GenevaScheduleRealtime.get_route_stops'
    route_stops
  end

  def map_line line
    {
      "date" => line[0],
      "routeCode" => line[1],
      "serviceVehicle" => line[2],
      "tripId" => line[3],
      "vehicleId" => line[4],
      "patternId" => line[5],
      "tripDirection" => line[6],
      "tripLength" => line[7],
      "stopSequenceNr" => line[8],
      "stopCode" => line[9],
      "stopLength" => line[10],
      "stopTimeSchedule" => line[11],
      "stopTimeReal" => line[12],
      "passengerCountTripUp" => line[13],
      "passengerCountTripDown" => line[14],
      "passengerCountStopUp" => line[15],
      "passengerCountStopDown" => line[16],
      "passengerLoadStop" => line[17]
    }

  end

end