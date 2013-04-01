require 'trollop'
require 'json'
require 'csv'
require './zur_buses'
require './zur_schedule_realtime'
require './zur_stops'
require './zur_route'


class ZurGenerateStop

  def self.run_argv argv = ARGV
    opts = Trollop::options do
      opt :routeNum, "Route number to process", :type => String, :default => "1"
    end
    opts[:out] = '../html/data/stops/zur_%d.json' % [opts[:routeNum]]
    segments_file = '../html/data/segments/zur_%d.json' % [opts[:routeNum]]
    stops_file = '../../data/zur_stops.csv'
    routecsv_filename = '../../data/zur_routes.csv'
    route_num = opts[:routeNum]

    route = ZurRoute.new File.read(segments_file)
    stops = ZurStops.new stops_file, route_num, nil, true
    stop_csv = ZurScheduleRealtime.new routecsv_filename
    buses = ZurBuses.new route_num, route, stops, stop_csv
    stops.add_passenger_loads buses

    File.write opts[:out], stops.to_json
  end

end

if __FILE__ == $PROGRAM_NAME
   ZurGenerateStop.run_argv 
end