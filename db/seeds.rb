# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

role_admin = Role.create(name: 'admin')
User.create(first_name: 'admin', last_name: 'admin', email: 'admin', password: 'T2Oconcierto2013', roles: [role_admin])

Activity.create(description: 'install')
Activity.create(description: 'fan')
