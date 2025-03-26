from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Skill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    icon = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # 'technical', 'soft', or 'tools'
    proficiency = db.Column(db.Integer, default=0)  # value from 0-100 for progress bar
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'icon': self.icon,
            'category': self.category,
            'proficiency': self.proficiency
        }

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    icon = db.Column(db.String(100), nullable=False)  # For placeholder icon (e.g. 'fas fa-code')
    category = db.Column(db.String(50), nullable=False)  # 'web', 'app', 'design', etc.
    live_link = db.Column(db.String(255), nullable=True)
    code_link = db.Column(db.String(255), nullable=True)
    tags = db.Column(db.Text, nullable=True)  # Comma-separated list of tags
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'icon': self.icon,
            'category': self.category,
            'live_link': self.live_link,
            'code_link': self.code_link,
            'tags': self.tags.split(',') if self.tags else []
        }

class Certification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    provider = db.Column(db.String(100), nullable=False)
    year = db.Column(db.String(4), nullable=False)
    icon = db.Column(db.String(100), nullable=False)  # 'fas fa-certificate' or 'fas fa-award'
    link = db.Column(db.String(255), nullable=True)  # Link to view certificate
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'provider': self.provider,
            'year': self.year,
            'icon': self.icon,
            'link': self.link
        }