class Clue < ActiveRecord::Base
  attr_accessible :active, :description, :image_url, :latitude, :longitude, :radius, :source_type
	has_many :tickets
	geocoded_by :description

	def self.active_to_user
		clues = Clue.find_all_by_active(true)
		hidden_clues = []
		clues.each do |clue|
			hidden_clues << {:description => clue.description, :image_url => clue.image_url}
		end
		return hidden_clues
	end

	def assign_tickets number
		number.to_i.times do
			folio = SecureRandom.uuid.slice(0,7)
			self.tickets << Ticket.create(:clue_id => self.id, :source_type => self.source_type, :folio => folio)
		end
	end
end
