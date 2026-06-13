import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from config.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(20), default="user")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    profile = relationship("Profile", back_populates="user", uselist=False)
    applications = relationship("Application", back_populates="user")

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    goal = Column(String(100), default="AI Engineer")
    skills = Column(JSON, default=[]) # Stores arrays of skills as JSON
    location = Column(String(100), default="")
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)

    # Relationships
    user = relationship("User", back_populates="profile")

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(100), nullable=False)
    company = Column(String(100), nullable=False)
    status = Column(String(50), default="applied") # applied, interview, selected, rejected
    notes = Column(String(500), default="")
    applied_date = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="applications")
