require 'trollop'
require 'json'
require 'csv'
require './zur_buses'
require './zur_schedule_realtime'
require './zur_stops'
require './zur_route'


class ZurGenerateBus

  def self.run_argv argv = ARGV
    opts = Trollop::options do
      opt :routeNum, "Route number to process", :type => String, :default => "1"
    end
    opts[:out] = '../html/data/buses/zur_%d.json' % [opts[:routeNum]]
    segments_file = '../html/data/segments/zur_%d.json' % [opts[:routeNum]]
    stops_file = '../../data/zur_stops.csv'
    routecsv_filename = '../../data/zur_routes.csv'
    route_num = opts[:routeNum]
    route = ZurRoute.new File.read(segments_file)
    stops = ZurStops.new stops_file, route_num, nil, true
    route_csv = ZurScheduleRealtime.new routecsv_filename
    buses = ZurBuses.new route_num, route, stops, route_csv

    # puts buses.to_json
    File.write opts[:out], buses.to_json
  end

end

if __FILE__ == $PROGRAM_NAME
   ZurGenerateBus.run_argv 
end