class Referral < ActiveRecord::Base
  attr_accessible :accepted, :referred_uid, :user_id
	belongs_to :user
	belongs_to :referred, :class_name => "User", :foreign_key => :referred_uid, :primary_key => :uid
end
