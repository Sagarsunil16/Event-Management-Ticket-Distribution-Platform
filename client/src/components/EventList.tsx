import { useEffect, useState } from "react";
import { Search, Calendar, MapPin, Filter } from "lucide-react";
import api from "../services/api";
import { Link } from "react-router-dom";

interface Event {
  _id: string;
  title: string;
  date: string;
  venue: string;
  category: string;
  description?: string;
  price?: number;
  image?: string;
}

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/events/")
      .then((res) => {
        setEvents(res.data);
        setFilteredEvents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.venue.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (event) => event.category === selectedCategory
      );
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedCategory]);

  const categories = [
    "all",
    ...Array.from(new Set(events.map((event) => event.category))),
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      music: "bg-purple-100 text-purple-800 border-purple-200",
      sports: "bg-blue-100 text-blue-800 border-blue-200",
      technology: "bg-green-100 text-green-800 border-green-200",
      business: "bg-orange-100 text-orange-800 border-orange-200",
      arts: "bg-pink-100 text-pink-800 border-pink-200",
      food: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return (
      colors[category.toLowerCase() as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return { day, month, time };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Upcoming Events
          </h1>
          <p className="text-slate-600 mb-6">
            Discover amazing events happening near you
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events or venues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white min-w-[150px]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all"
                      ? "All Categories"
                      : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              No events found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const { day, month, time } = formatDate(event.date);
              return (
                <div
                  key={event._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
                >
                  {/* Event Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-emerald-400 to-emerald-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4 bg-white rounded-lg p-2 text-center min-w-[60px]">
                      <div className="text-2xl font-bold text-slate-900">
                        {day}
                      </div>
                      <div className="text-xs font-medium text-slate-600 uppercase">
                        {month}
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                          event.category
                        )}`}
                      >
                        {event.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                      {event.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-slate-600">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                        <span className="text-sm">{time}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                        <span className="text-sm">{event.venue}</span>
                      </div>
                    </div>

                    {event.description && (
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      {event.price !== undefined && (
                        <span className="text-lg font-semibold text-emerald-600">
                          {event.price === 0 ? "Free" : `$${event.price}`}
                        </span>
                      )}
                      <Link to={`/events/${event._id}`}>
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors ml-auto">
                        View Details
                      </button>
                        </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;
