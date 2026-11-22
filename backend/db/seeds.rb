admin_email = ENV.fetch("ADMIN_EMAIL", "admin@landchecker.com").strip.downcase
admin_password = ENV["ADMIN_PASSWORD"]

if admin_password.blank?
  puts "ADMIN_PASSWORD is not set. Skipping default admin seeding."
else
  admin = User.find_or_initialize_by(email: admin_email)

  if admin.new_record?
    admin.password = admin_password
    admin.role = "admin"
    admin.save!

    puts "Default admin created: #{admin_email}"
  else
    unless admin.admin?
      admin.update!(role: "admin")
    end

    puts "Default admin already exists: #{admin_email}"
  end
end
