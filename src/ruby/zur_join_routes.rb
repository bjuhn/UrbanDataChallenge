require 'trollop'
require 'json'
require './zur_route'

class ZurJoinRoutes

  def self.run_argv argv = ARGV
    opts = Trollop::options do
      opt :routeNum, "Route number to process", :type => String, :default => "1"
    end

    filename1 = '../../data/route_shapes/zur/route%s/Route%s.shp' % [opts[:routeNum], opts[:routeNum]]
    output = '../html/data/segments/zur_%s.json' % [opts[:routeNum]]

    tmp_filename1 = zur_geojson filename1

    route1 = ZurRoute.new File.read(tmp_filename1)
    File.write output, route1.to_json

  end

  def self.zur_geojson filename
    new_file = '/tmp/' + filename.split('/').last().split('.').first() + '.json'
    cmd = 'ogr2ogr -t_srs EPSG:4326 -f "GeoJson" %s %s' % [new_file, filename]
    value = `#{cmd}`
    if $?.exitstatus != 0
      puts "ogr2ogr failed: %d" % [$?.exitstatus]
      exit $?.exitstatus
    end
    new_file
  end

end

if __FILE__ == $PROGRAM_NAME
   ZurJoinRoutes.run_argv 
end