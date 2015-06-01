require 'WEBrick'
require 'json'
require 'yaml'
require 'rake/clean'

BASE = "recipes"

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
directory "#{BASE}/json"
directory "#{BASE}/yaml"

# Source files that we have 
source = FileList["#{BASE}/_source/yaml/*.yaml"].exclude("**/_*.yaml")

# JSON files are something we'd like 
target_json = source.pathmap("#{BASE}/json/%n.json")

# YAML files are something we'd like 
target_yaml = source.pathmap("#{BASE}/yaml/%n.yaml")

# Describe the json task as the json file list 
task :build => [
	# Directories 
	"#{BASE}/json", 
	"#{BASE}/yaml",

	# Formats 
	:json, 
	:yaml, 

	# Index
	:index_json,
	:index_yaml
]

task :json => target_json
task :yaml => target_yaml

# Add to our clobber list 
CLOBBER
	.include(target_json)
	.include(target_yaml)
	.include("#{BASE}/json")
	.include("#{BASE}/yaml")
	.include("#{BASE}/json/_index.json")
	.include("#{BASE}/yaml/_index.yaml")


# Reads and prepares a YAML file for a final output 
def read_and_prepare_yaml(filename) 
	
	# Read the file 
	source = File.read filename

	# Process text
	source = process_text(source)

	# Read YAML
	data = YAML.load(source)

	# Process data 
	data = process_data(data)

	data

end

# Allows use to process the source text before providing 
# it to the various output formats (json, yaml)
def process_text(text)

	# Handle imports
	text.gsub! /!include: (.*)\n/ do
		File.read "#{BASE}/_source/yaml/#{$1}"
	end

	# Handle fractions 
	# Fraction entities are included in the source text, but for the outputs, we want to convert them 
	text.gsub! /\s?½/, " 1/2"
	text.gsub! /\s?¼/, " 1/4" 
	text.gsub! /\s?¾/, " 3/4"

	return text 

end

# Allows use to process the source data before providing 
# it to the various output formats (json, yaml)
def process_data(data)

	return data 

end


# Combine the source and the target files into pairs 
# http://confreaks.com/videos/1139-scrc2012-power-rake
source.zip(target_json).each do |source, target|

	# Create a file task for each 
	file target => [source] do |task|
		
		data = read_and_prepare_yaml(task.source)

		# Put out the JSON file 
		File.write(task.name, JSON.pretty_generate(data))
	end

end

source.zip(target_yaml).each do |source, target|

	# Create a file task for each 
	file target => [source] do |task|
		
		data = read_and_prepare_yaml(task.source)

		# Put out the JSON file 
		File.write(task.name, data.to_yaml)
	end

end

# Describe how to generate an index file 
task :index_json => ["#{BASE}/json/_index.json"]
task :index_yaml => ["#{BASE}/yaml/_index.yaml"]

file "#{BASE}/json/_index.json" do |task|
	File.write task.name, JSON.pretty_generate(target_json.pathmap("%f").to_a)
end

file "#{BASE}/yaml/_index.yaml" do |task|
	File.write task.name, target_yaml.pathmap("%f").to_a.to_yaml
end
