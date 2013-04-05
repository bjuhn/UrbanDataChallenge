require 'trollop'
require 'json'
require './geneva_route'
require './geneva_stops'

class GenevaJoinRoutes

  def self.run_argv argv = ARGV
    opts = Trollop::options do
      opt :routeNum, "Route number to process", :type => String, :default => "1"
    end

    filename1 = '../../data/route_shapes/geneva/route%s/Route%sDirASplit.shp' % [opts[:routeNum], opts[:routeNum]]
    filename2 = '../../data/route_shapes/geneva/route%s/Route%sDirRSplit.shp' % [opts[:routeNum], opts[:routeNum]]
    output = '../html/data/segments/gen_%s.json' % [opts[:routeNum]]
    stops_file = '../../sub/udc/public-transportation/geneva/geo/geojson/stops.json'

    tmp_filename1 = gen_geojson filename1
    tmp_filename2 = gen_geojson filename2

    stops = GenevaStops.new stops_file, opts[:routeNum]
    route1 = GenevaRoute.new File.read(tmp_filename1)
    route2 = GenevaRoute.new File.read(tmp_filename2)
    route1.add_features route2.get_features
    route1.add_stops stops
    puts 'writing file'
    File.write output, route1.to_json

  end

  def self.gen_geojson filename
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
   GenevaJoinRoutes.run_argv 
end