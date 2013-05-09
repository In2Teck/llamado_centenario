class Ticket < ActiveRecord::Base
  attr_accessible :clue_id, :folio, :source_type, :assigned
	has_one :user
	belongs_to :clue

	KILOMETER_TO_MILE = 0.621
	SOURCE_REFERRALS = "referrals"

	def self.locate_and_assign latitude, longitude, source_type, current_user
    Ticket.log_user_try current_user, source_type, latitude, longitude
		result = {}
		clues = Clue.find_all_by_active_and_source_type(true, source_type)
		if (clues.length > 0)
			clues.each do |clue|
				current_user.clues << clue
				current_user.save
				distance = clue.distance_from([latitude, longitude])
				if (not current_user.ticket) and (distance <= clue.radius * KILOMETER_TO_MILE)
					tickets_to_assign = clue.tickets.where("assigned = ?", false)
					ticket_count = tickets_to_assign.count
					if ticket_count >= 1
						ticket_to_assign = tickets_to_assign.first
						ticket_to_assign.update_attribute(:assigned, true)
						current_user.update_attribute(:ticket, ticket_to_assign)
            Ticket.send_winning_email current_user
						if ticket_count == 1
							clue.update_attribute(:active, false)
						end
						result = {:won_ticket => true, :error => false, :folio => ticket_to_assign.folio}
					else
						raise 'No more tickets to assign and the clue is still active.'
					end
				else 
					result = {:won_ticket => false, :error => false}
				end
			end
		else
			result = {:won_ticket => false, :error => true, :code => 1}
		end
		return result
	end

	def self.create_and_assign_to_user user
		user.update_attribute(:ticket, Ticket.create(:folio => SecureRandom.uuid.slice(0,7), :source_type => SOURCE_REFERRALS, :assigned => true))
    Ticket.send_winning_email user
	end

  def self.send_winning_email user
    begin
      UserMailer.send_win_notification(user).deliver
    rescue
      logger.error "The email couldn't be delivered to #{user.first_name}. Please check the settings."
    end
  end

  #custom try logger

  def self.try_logger
    @@try_logger ||= Logger.new(File.join(Rails.root, 'log', 'try_log.log'))
  end

  def self.log_user_try current_user, source_type, latitude, longitude
    begin
      Ticket.try_logger.info("#{Time.now.in_time_zone('Central Time (US & Canada)').to_formatted_s(:short)} user: #{current_user.uid}, type: #{source_type}, lat: #{latitude}, lng: #{longitude}")
    rescue
      logger.error "The custom try_logger is not working."
    end
  end

end
