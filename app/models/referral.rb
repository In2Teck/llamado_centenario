class Referral < ActiveRecord::Base
  attr_accessible :accepted, :referred_uid, :user_id
	belongs_to :user
	belongs_to :referred, :class_name => "User", :foreign_key => :referred_uid, :primary_key => :uid

	def accept
		self.update_attribute(:accepted, true)
		user = User.find_by_uid(self.referred_uid)
		user.update_attribute(:referred_user_id, self.user_id)
	end
end
