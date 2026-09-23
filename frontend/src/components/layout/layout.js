import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from '../signin/login';
import Home from "../home/home";
import Movie from "../movie/movie";
import CustomeNavbar from "../navbar/navbar";
import Watchlist from "../watchlist/watchlist";
import Register from "../signup/siginup";
import { LanguageProvider } from "../../context/LanguageContext";
import MovieByLanguage from "../byLanguage/movieByLangauge";
import AddMovie from "../AddMovie/add movie";
import SeatBooking from "../booking/SeatBooking";
import TicketConfirmation from "../booking/TicketConfirmation";
import MyBookings from "../booking/MyBookings";

function Layout() {
    return (
        <LanguageProvider>
            <CustomeNavbar />
            <div style={{ minHeight: 'calc(100vh - 65px)', backgroundColor: '#070F2B' }}>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Register />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/movie/:id" element={<Movie />} />
                    <Route path="/book/:id" element={<SeatBooking />} />
                    <Route path="/ticket/:bookingId" element={<TicketConfirmation />} />
                    <Route path="/bookings" element={<MyBookings />} />
                    <Route path="/watchlist" element={<Watchlist />} />
                    <Route path="/moviebylanguage" element={<MovieByLanguage />} />
                    <Route path="/admin" element={<AddMovie />} />
                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
            </div>
        </LanguageProvider>
    );
}

export default Layout;