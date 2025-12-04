
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LikesPage from './pages/LikesPage';
import ChatListPage from './pages/ChatListPage';
import ChatPage from './pages/ChatPage';
import MyProfilePage from './pages/MyProfilePage';
import UserProfilePage from './pages/UserProfilePage';
import StorePage from './pages/StorePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EditProfilePage from './pages/EditProfilePage';
import BlockedListPage from './pages/BlockedListPage';
import BookmarksListPage from './pages/BookmarksListPage';
import VisitorsListPage from './pages/VisitorsListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import BottomNavBar from './components/BottomNavBar';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="max-w-md mx-auto h-screen bg-white dark:bg-black flex flex-col font-sans">
          <AppContent />
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <>
      <main className="flex-grow overflow-y-auto">
        <Routes>
          {!currentUser ? (
            <>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/likes" element={<LikesPage />} />
              <Route path="/chats" element={<ChatListPage />} />
              <Route path="/chat/:userId" element={<ChatPage />} />
              <Route path="/profile" element={<MyProfilePage />} />
              <Route path="/user/:userId" element={<UserProfilePage />} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/product/:productId" element={<ProductDetailPage />} />
              <Route path="/edit-profile" element={<EditProfilePage />} />
              <Route path="/blocked" element={<BlockedListPage />} />
              <Route path="/bookmarks" element={<BookmarksListPage />} />
              <Route path="/visitors" element={<VisitorsListPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </main>
      {currentUser && <BottomNavBar />}
    </>
  );
};

export default App;
