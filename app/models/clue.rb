class Clue < ActiveRecord::Base
  attr_accessible :active, :description, :image_url, :latitude, :longitude, :radius, :source_type
	has_many :tickets
  has_and_belongs_to_many :users
	geocoded_by :description

	def self.active_to_user type
		clues = Clue.find_all_by_active_and_source_type(true, type)
		hidden_clues = []
		clues.each do |clue|
      total_tickets = Ticket.where("clue_id = ?", clue.id)
      remain_tickets = total_tickets.length
      total_tickets.each do |ticket|
        remain_tickets -= 1 if ticket.assigned == true
      end
			hidden_clues << {:id => clue.id, :description => clue.description, :image_url => clue.image_url, :source_type => clue.source_type, 
        :total_tickets => total_tickets.length, :remain_tickets => total_tickets.length - remain_tickets}
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
