class Referral < ActiveRecord::Base
  attr_accessible :accepted, :referred_uid, :user_id
	belongs_to :user
	belongs_to :referred, :class_name => "User", :foreign_key => :referred_uid, :primary_key => :uid

  def self.create_batch referrals
    referrals.each do |referral|
      begin
        Referral.create(referral)
      rescue
        logger.error("Non unique referral for user_id:#{referral['user_id']} and referred_uid:#{referral['referred_uid']}")
      end
    end
  end

	def self.accept user_uid, referred_id
    origin_user = User.find_by_uid(user_uid)
    referred_user = User.find(referred_id)
    referral = Referral.find_by_user_id_and_referred_uid(origin_user.id, referred_user.uid)
    if referral
		  referral.update_attribute(:accepted, true)
  		referred_user.update_attribute(:referred_user_id, origin_user.id)
    else
      raise "No referral found for user_uid:#{user_uid} and referred_id:#{referred_id}"
    end
	end

	def self.find_top_referrers result_size
    #TODO: Insert custom query that gets the number of accepted referrals on the fly
		#User.where("ticket_id is null").order("friend_count desc").limit(result_size)
    Referral.joins(:user).select("user_id, count(user_id) as referral_count").where("accepted = ? AND users.ticket_id is null", true).group("user_id").order("referral_count DESC").limit(20)
	end

end
