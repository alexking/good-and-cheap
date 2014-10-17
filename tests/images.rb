require "rspec"
require "JSON"

class RecipeImage

	def self.image_names 
		index = File.read "data/good-and-cheap/json/_index.json"
		files = JSON.load index

		files.map! do |file|
			file.sub('json', 'png')
		end

		files
	end

end

describe RecipeImage do 

	names = RecipeImage.image_names
	names.each do |name|
		
		it "#{name} should exist" do 

			expect(File.exists? "data/good-and-cheap/images/rename/#{name}").to be true

		end


	end

end