class Clue < ActiveRecord::Base
  attr_accessible :active, :description, :image_url, :latitude, :longitude, :radius
	has_many :tickets
end
