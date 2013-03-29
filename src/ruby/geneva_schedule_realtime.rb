class GenevaScheduleRealtime

  def initialize filename
    @lines = []
    @filename = filename
  end

  def get_route_stops route_code
    put 'begin: GenevaScheduleRealtime.get_route_stops'
    route_stops = []
    CSV.foreach(@filename,{:headers=>:first_row}) do |line|
      mapped_line = map_line(line)
      route_stops.push mapped_line if mapped_line[:routeCode] == route_code
    end
    puts 'end: GenevaScheduleRealtime.get_route_stops'
    route_stops
  end

  def map_line line
    {
      :date => line[0],
      :routeCode => line[1],
      :serviceVehicle => line[2],
      :tripId => line[3],
      :vehicleId => line[4],
      :patternId => line[5],
      :tripDirection => line[6],
      :tripLength => line[7],
      :stopSequenceNr => line[8],
      :stopCode => line[9],
      :stopLength => line[10],
      :stopTimeSchedule => line[11],
      :stopTimeReal => line[12],
      :passengerCountTripUp => line[13],
      :passengerCountTripDown => line[14],
      :passengerCountStopUp => line[15],
      :passengerCountStopDown => line[16],
      :passengerLoadStop => line[17]
    }

  end

end