require 'csv'
require 'json'
require 'trollop'

class ScheduledArrivalsExp

	def self.run_argv argv = ARGV
		opts = Trollop::options do
  			opt :quiet, "Use minimal output", :short => 'q'
	  		opt :interactive, "Be interactive"
  			opt :file_name, "File to process", :type => String, :default => '../../sub/udc/public-transportation/san-francisco/scheduled-arrivals.excerpt.csv'
  			opt :format, "Format to process", :type => String, :default => 'json'
		end

		if opts[:format] == 'json' 
			puts csv_to_json(opts[:file_name])
		end
	end

	def self.csv_to_json file_name
		obj = csv_to_obj file_name
		obj.to_json
	end

	def self.csv_to_obj file_name
		routes = {}
		CSV.foreach(file_name,{:headers=>:first_row}) do |line|
			mapped_line = map_line(line)
			add_arrival routes, mapped_line
		end
		routes
	end

	def self.map_line line
		{
			:public_route_name => line[0],
			:trip_id => line[1],
			:block_name => line[2],
			:longitude => line[3],
			:latitude => line[4],
			:scheduled_arrival_time => line[5]
		}
	end

	def self.new_arrival mapped_line
		{
			:type => "Feature",
			:geometry => {
				:type => "Point",
				:coordinates => [mapped_line[:longitude], mapped_line[:latitude]]
			},
			:properties => {
				:public_route_name => mapped_line[:public_route_name],
				:block_name => mapped_line[:blcok_name],
				:scheduled_arrival_time => mapped_line[:scheduled_arrival_time]
			}
		}
	end

	def self.new_route mapped_line
		{
			:type => "FeatureCollection",
			:properties => {
				:trip_id => mapped_line[:trip_id]
			},
			:features => []
		}
	end

	def self.add_arrival routes, mapped_line
		route = routes[mapped_line[:trip_id]]
		if route.nil?
			route = new_route mapped_line
		end
		route[:features].push new_arrival mapped_line
		routes[mapped_line[:trip_id]] = route
	end

end

if __FILE__ == $PROGRAM_NAME
	 ScheduledArrivalsExp.run_argv 
end