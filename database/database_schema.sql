-- ==========================================
-- MySQL Database Schema
-- AI Study Assistant Database
-- ==========================================

-- Create database
CREATE DATABASE IF NOT EXISTS study_assistant_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE study_assistant_db;

-- ==========================================
-- Users Table
-- ==========================================
CREATE TABLE IF NOT EXISTS users_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    password VARCHAR(128) NOT NULL,
    last_login DATETIME(6) NULL,
    is_superuser TINYINT(1) NOT NULL DEFAULT 0,
    username VARCHAR(150) NOT NULL UNIQUE,
    first_name VARCHAR(150) NOT NULL DEFAULT '',
    last_name VARCHAR(150) NOT NULL DEFAULT '',
    email VARCHAR(254) NOT NULL UNIQUE,
    is_staff TINYINT(1) NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    date_joined DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    role VARCHAR(50) NOT NULL DEFAULT 'student',
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Notes Table
-- ==========================================
CREATE TABLE IF NOT EXISTS users_note (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    file_path VARCHAR(500) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users_user(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Quizzes Table
-- ==========================================
CREATE TABLE IF NOT EXISTS users_quiz (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    questions_json JSON NOT NULL,
    score INT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users_user(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Flashcards Table
-- ==========================================
CREATE TABLE IF NOT EXISTS users_flashcard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    cards_json JSON NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users_user(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- User Progress Table
-- ==========================================
CREATE TABLE IF NOT EXISTS users_userprogress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_type VARCHAR(50) NOT NULL,
    activity_data JSON NOT NULL,
    timestamp DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users_user(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_activity_type (activity_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Translations Table
-- ==========================================
CREATE TABLE IF NOT EXISTS users_translation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    original_text LONGTEXT NOT NULL,
    translated_text LONGTEXT NOT NULL,
    source_lang VARCHAR(10) NOT NULL DEFAULT 'en',
    target_lang VARCHAR(10) NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users_user(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_target_lang (target_lang)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Uploaded Images Table
-- ==========================================
CREATE TABLE IF NOT EXISTS users_uploadedimage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    extracted_text LONGTEXT NULL,
    ocr_confidence DECIMAL(5,2) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users_user(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- User Preferences Table
-- ==========================================
CREATE TABLE IF NOT EXISTS users_userpreference (
    id INT AUTO_INCREMENT PRIMARY KEY,
    preferred_language VARCHAR(10) NOT NULL DEFAULT 'en',
    theme VARCHAR(20) NOT NULL DEFAULT 'dark',
    notifications_enabled TINYINT(1) NOT NULL DEFAULT 1,
    auto_save TINYINT(1) NOT NULL DEFAULT 1,
    preferences_json JSON NULL,
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    user_id INT NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users_user(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Django Required Tables (for migrations)
-- ==========================================
CREATE TABLE IF NOT EXISTS django_migrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    app VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    applied DATETIME(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS django_content_type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_label VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    UNIQUE KEY django_content_type_app_label_model (app_label, model)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS django_session (
    session_key VARCHAR(40) PRIMARY KEY,
    session_data LONGTEXT NOT NULL,
    expire_date DATETIME(6) NOT NULL,
    INDEX django_session_expire_date (expire_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Sample Data (Optional)
-- ==========================================
-- Uncomment to insert sample user
-- INSERT INTO users_user (username, email, password, role, is_staff, is_superuser) 
-- VALUES ('testuser', 'test@example.com', 'pbkdf2_sha256$...', 'student', 0, 0);
