require 'trollop'
require 'json'
require './sf_route'
require './sf_stops'

class SFJoinRoutes

  def self.run_argv argv = ARGV
    opts = Trollop::options do
      opt :routeNum, "Route number to process", :type => String, :default => "1"
    end
    route_num = opts[:routeNum].rjust(3, '0')
    filename1 = '../../data/route_shapes/sf/route%s/Route%sDir0Split.shp' % [opts[:routeNum], opts[:routeNum]]
    filename2 = '../../data/route_shapes/sf/route%s/Route%sDir1Split.shp' % [opts[:routeNum], opts[:routeNum]]
    stops_file = '../../data/sf_stops.csv'
    output = '../html/data/segments/sf_%s.json' % [opts[:routeNum]]

    tmp_filename1 = sf_geojson filename1
    tmp_filename2 = sf_geojson filename2

    stops = SFStops.new stops_file, route_num, nil, true
    route1 = SFRoute.new File.read(tmp_filename1)
    route2 = SFRoute.new File.read(tmp_filename2)
    route1.add_features route2.get_features
    route1.add_stops stops
    puts 'writing file'
    File.write output, route1.to_json

  end

  def self.sf_geojson filename
    new_file = '/tmp/' + filename.split('/').last().split('.').first() + '.json'
    cmd = 'ogr2ogr -f "GeoJson" %s %s' % [new_file, filename]
    value = `#{cmd}`
    if $?.exitstatus != 0
      puts "ogr2ogr failed: %d" % [$?.exitstatus]
      exit $?.exitstatus
    end
    new_file
  end

end

if __FILE__ == $PROGRAM_NAME
   SFJoinRoutes.run_argv 
end