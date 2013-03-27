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
    number = number.to_i
    if self.tickets_not_assigned.count == number
      return
    elsif self.tickets_not_assigned.count > number # delete tickets
      number_to_delete = self.tickets_not_assigned.count - number

      count = 0
      self.tickets_not_assigned.each do |ticket|
        ticket.destroy
        count += 1
        if count == number_to_delete
          break
        end
      end
    else # add tickets
      number_to_add = number - self.tickets_not_assigned.count  
      self.create_tickets number_to_add
    end
	end
  
  def create_tickets number
		number.to_i.times do
			folio = SecureRandom.uuid.slice(0,7)
			self.tickets << Ticket.create(:clue_id => self.id, :source_type => self.source_type, :folio => folio)
		end
  end

  def tickets_not_assigned
    tickets = []
    self.tickets.each do |ticket|
      tickets << ticket unless ticket.user
    end
    return tickets
  end

end
