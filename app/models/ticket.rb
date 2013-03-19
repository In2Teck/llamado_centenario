class Ticket < ActiveRecord::Base
  attr_accessible :clue_id, :folio, :source_type
	has_one :user
	belongs_to :clue
end
