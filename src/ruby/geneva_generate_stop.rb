require 'trollop'
require 'json'
require 'csv'
require './geneva_buses'
require './geneva_schedule_realtime'
require './geneva_stops'
require './geneva_route'


class GenevaGenerateStop

  def self.run_argv argv = ARGV
    opts = Trollop::options do
      opt :routeNum, "Route number to process", :type => String, :default => "1"
    end
    opts[:out] = '../html/data/stops/gen_%d.json' % [opts[:routeNum]]
    segments_file = '../html/data/segments/gen_%d.json' % [opts[:routeNum]]
    stops_file = '../../sub/udc/public-transportation/geneva/geo/geojson/stops.json'
    stopcsv_filename = '../../sub/udc/public-transportation/geneva/schedule-real-time.csv'

    route = GenevaRoute.new File.read(segments_file)
    stops = GenevaStops.new stops_file, opts[:routeNum]
    stop_csv = GenevaScheduleRealtime.new stopcsv_filename
    buses = GenevaBuses.new opts[:routeNum], route, stops, stop_csv
    stops.add_passenger_loads buses
    # puts buses.to_json
    File.write opts[:out], stops.to_json
  end

end

if __FILE__ == $PROGRAM_NAME
   GenevaGenerateStop.run_argv 
end