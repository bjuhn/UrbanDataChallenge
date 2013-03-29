require 'trollop'
require 'json'
require 'csv'
require './geneva_buses'
require './geneva_schedule_realtime'
require './geneva_stops'
require './geneva_route'


class GenevaGenerateBus

  def self.run_argv argv = ARGV
    opts = Trollop::options do
      opt :routeNum, "Route number to process", :type => String, :default => "1"
    end
    opts[:out] = '../html/data/buses/gen_%d.json' % [opts[:routeNum]]
    segments_file = '../html/data/segments/gen_%d.json' % [opts[:routeNum]]
    stops_file = '../../sub/udc/public-transportation/geneva/geo/geojson/stops.json'
    stopcsv_filename = '../../sub/udc/public-transportation/geneva/schedule-real-time_1.csv'

    route = GenevaRoute.new File.read(segments_file)
    stops = GenevaStops.new stops_file, opts[:routeNum]
    stop_csv = GenevaScheduleRealtime.new stopcsv_filename
    buses = GenevaBuses.new opts[:routeNum], route, stops, stop_csv

    # puts buses.to_json
    File.write opts[:out], buses.to_json
  end

end

if __FILE__ == $PROGRAM_NAME
   GenevaGenerateBus.run_argv 
end