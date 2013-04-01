require 'trollop'
require 'json'
require 'csv'
require './sf_buses'
require './sf_schedule_realtime'
require './sf_stops'
require './sf_route'


class SFGenerateBus

  def self.run_argv argv = ARGV
    opts = Trollop::options do
      opt :routeNum, "Route number to process", :type => String, :default => "1"
    end
    opts[:out] = '../html/data/buses/sf_%d.json' % [opts[:routeNum]]
    segments_file = '../html/data/segments/sf_%d.json' % [opts[:routeNum]]
    stops_file = '../../data/sf_stops.csv'
    routecsv_filename = '../../data/sf_routes.csv'
    route_num = opts[:routeNum].rjust(3, '0')
    route = SFRoute.new File.read(segments_file)
    stops = SFStops.new stops_file, route_num, nil, true
    route_csv = SFScheduleRealtime.new routecsv_filename
    buses = SFBuses.new route_num, route, stops, route_csv

    # puts buses.to_json
    File.write opts[:out], buses.to_json
  end

end

if __FILE__ == $PROGRAM_NAME
   SFGenerateBus.run_argv 
end