require 'csv'

time_start = Time.now

accidents_by_intersection = Hash.new(0)
accidents_by_neighborhood = Hash.new(0)
CSV.foreach('./data/traffic-accidents.csv') do |row|
  accidents_by_intersection[row[9]] += 1 if row[9]
  accidents_by_neighborhood[row[16]] += 1 if row[16]
end

worst_traffic_intersections = accidents_by_intersection.max_by(5) { |a| a[1] }
worst_traffic_neighborhoods = accidents_by_neighborhood.max_by(5) { |a| a[1] }

crime_by_neighborhood = Hash.new(0)
CSV.foreach('./data/crime.csv') do |row|
  crime_by_neighborhood[row[16]] += 1 if row[16] && row[5] != 'traffic-accident'
end

worst_crime_neighborhoods = crime_by_neighborhood.max_by(5) { |a| a[1] }

puts(worst_traffic_intersections)
puts(worst_traffic_neighborhoods)
puts(worst_crime_neighborhoods)
puts("entire process took #{Time.now - time_start} seconds")
