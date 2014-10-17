require 'WEBrick'
require 'json'
require 'yaml'
require 'rake/clean'

base = "recipes"

# Default task to generate 
task default: [ :build ]

# Task to start a local development server 
# This just lets you access things like http://127.0.0.1:8000/recipes/json/_index.json
task :serve do 

	web = WEBrick::HTTPServer.new :Port => 8000, :DocumentRoot => File.expand_path(".")
	web.start

	# http://www.ruby-doc.org/stdlib-1.9.3/libdoc/webrick/rdoc/WEBrick.html
	trap 'INT' do 
		server.shutdown
	end
end

# Task to run tests 
task :test do 
	sh "rspec"
end

# Tell rake how to do things 
directory "#{base}/json"

# Source files that we have 
source = FileList["#{base}/_source/yaml/*.yaml"].exclude("**/_*.yaml")

# JSON files are something we'd like 
target_json = source.pathmap("#{base}/json/%n.json")

# Describe the json task as the json file list 
task :build => ["#{base}/json", :json, :index]
task :json => target_json

# Add to our clobber list 
CLOBBER
	.include(target_json)
	.include("#{base}/json")
	.include("#{base}/json/_index.json")

# Combine the source and the target files into pairs 
# http://confreaks.com/videos/1139-scrc2012-power-rake
source.zip(target_json).each do |source, target|

	# Create a file task for each 
	file target => [source] do |task|
		
		# Read the file 
		source = File.read task.source

		# Handle imports
		source.gsub! /!include: (.*)\n/ do
			File.read "#{base}/_source/yaml/#{$1}"
		end

		# Process YAML
		data = YAML.load(source)

		# Put out the JSON file 
		File.write(task.name, JSON.pretty_generate(data))
	end

end

# Describe how to generate an index file 
task :index => ["#{base}/json/_index.json"]

file "#{base}/json/_index.json" do |task|
	File.write task.name, JSON.pretty_generate(target_json.pathmap("%f").to_a)
end
