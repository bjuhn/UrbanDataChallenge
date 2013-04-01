require 'trollop'
require 'json'
require './sf_route'

class SFJoinRoutes

  def self.run_argv argv = ARGV
    opts = Trollop::options do
      opt :routeNum, "Route number to process", :type => String, :default => "1"
    end

    filename1 = '../../data/route_shapes/sf/route%s/Route%sDir0Split.shp' % [opts[:routeNum], opts[:routeNum]]
    filename2 = '../../data/route_shapes/sf/route%s/Route%sDir1Split.shp' % [opts[:routeNum], opts[:routeNum]]
    output = '../html/data/segments/sf_%s.json' % [opts[:routeNum]]

    tmp_filename1 = sf_geojson filename1
    tmp_filename2 = sf_geojson filename2

    route1 = SFRoute.new File.read(tmp_filename1)
    route2 = SFRoute.new File.read(tmp_filename2)
    route1.add_features route2.get_features
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