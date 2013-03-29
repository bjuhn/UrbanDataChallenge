require 'trollop'
require 'json'
require './geneva_route'


class GenevaJoinRoutes

  def self.run_argv argv = ARGV
    opts = Trollop::options do
      opt :routeNum, "Route number to process", :type => Integer, :default => 1
    end

    opts[:file1] = '../../data/route_shapes/geneva/route%d/Route%dDirASplit.shp' % [opts[:routeNum], opts[:routeNum]]
    opts[:file2] = '../../data/route_shapes/geneva/route%d/Route%dDirRSplit.shp' % [opts[:routeNum], opts[:routeNum]]
    opts[:out] = '../html/data/segments/gen_%d.json' % [opts[:routeNum]]

    file1_geojson = gen_geojson opts[:file1]
    file2_geojson = gen_geojson opts[:file2]
    join_geojson_routes file1_geojson, file2_geojson, opts[:out]
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

  def self.join_geojson_routes file1, file2, output
    route1 = GenevaRoute.new File.read(file1)
    route2 = GenevaRoute.new File.read(file2)
    route1.add_features route2.get_features
    File.write output, route1.to_json
    puts "Wrote file to: %s" % [output]
  end

end

if __FILE__ == $PROGRAM_NAME
   GenevaJoinRoutes.run_argv 
end