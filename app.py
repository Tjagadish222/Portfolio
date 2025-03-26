import os
import logging
import json
from flask import Flask, render_template, request, flash, redirect, url_for, jsonify
import smtplib
from email.message import EmailMessage
from models import db, Skill, Project, Certification

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create the Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")

# Configure the SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///portfolio.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db.init_app(app)

# Create tables if they don't exist
with app.app_context():
    db.create_all()
    
    # Seed initial skills if the database is empty
    if Skill.query.count() == 0:
        initial_skills = [
            Skill(name="HTML5", icon="fab fa-html5", category="technical", proficiency=95),
            Skill(name="CSS3", icon="fab fa-css3-alt", category="technical", proficiency=90),
            Skill(name="JavaScript", icon="fab fa-js", category="technical", proficiency=85),
            Skill(name="React.js", icon="fab fa-react", category="technical", proficiency=80),
            Skill(name="Python", icon="fab fa-python", category="technical", proficiency=75),
            Skill(name="Node.js", icon="fab fa-node-js", category="technical", proficiency=70),
            Skill(name="Project Management", icon="fas fa-tasks", category="soft", proficiency=0),
            Skill(name="Communication", icon="fas fa-comments", category="soft", proficiency=0),
            Skill(name="Problem Solving", icon="fas fa-lightbulb", category="soft", proficiency=0),
            Skill(name="Time Management", icon="fas fa-clock", category="soft", proficiency=0),
            Skill(name="Continuous Learning", icon="fas fa-book", category="soft", proficiency=0),
            Skill(name="Git & GitHub", icon="fab fa-git-alt", category="tools", proficiency=0),
            Skill(name="Docker", icon="fab fa-docker", category="tools", proficiency=0),
            Skill(name="AWS", icon="fab fa-aws", category="tools", proficiency=0),
            Skill(name="MongoDB", icon="fas fa-database", category="tools", proficiency=0),
            Skill(name="Adobe Creative Suite", icon="fas fa-palette", category="tools", proficiency=0),
            Skill(name="VS Code", icon="fas fa-laptop-code", category="tools", proficiency=0)
        ]
        
        for skill in initial_skills:
            db.session.add(skill)
        
        db.session.commit()
    
    # Seed initial projects if the database is empty
    if Project.query.count() == 0:
        initial_projects = [
            Project(
                title="E-Commerce Website",
                description="A full-featured online store with product listings, cart functionality, and secure checkout.",
                icon="fas fa-code",
                category="web",
                live_link="https://example.com",
                code_link="https://github.com",
                tags="HTML,CSS,JavaScript,Node.js"
            ),
            Project(
                title="Task Management App",
                description="A responsive task management application with drag-and-drop functionality and user authentication.",
                icon="fas fa-mobile-alt",
                category="app",
                live_link="https://example.com",
                code_link="https://github.com",
                tags="React,Redux,Firebase"
            ),
            Project(
                title="Travel Agency Redesign",
                description="Complete UI/UX redesign for a travel agency website, focusing on user experience and conversion.",
                icon="fas fa-paint-brush",
                category="design",
                live_link="https://example.com",
                code_link="https://github.com",
                tags="Figma,UI/UX,Wireframing"
            ),
            Project(
                title="Personal Blog Platform",
                description="A custom blog platform with content management system and responsive design.",
                icon="fas fa-blog",
                category="web",
                live_link="https://example.com",
                code_link="https://github.com",
                tags="Django,Python,PostgreSQL"
            ),
            Project(
                title="Investment Tracker",
                description="An application for tracking investments, visualizing data, and providing insights.",
                icon="fas fa-chart-line",
                category="app",
                live_link="https://example.com",
                code_link="https://github.com",
                tags="React Native,D3.js,API Integration"
            ),
            Project(
                title="Product Landing Page",
                description="A high-conversion product landing page with animations and call-to-action optimization.",
                icon="fas fa-shopping-bag",
                category="design",
                live_link="https://example.com",
                code_link="https://github.com",
                tags="Adobe XD,Animation,Prototyping"
            )
        ]
        
        for project in initial_projects:
            db.session.add(project)
        
        db.session.commit()
    
    # Seed initial certifications if the database is empty
    if Certification.query.count() == 0:
        initial_certifications = [
            Certification(
                title="Full Stack Web Developer",
                provider="Certification Provider",
                year="2022",
                icon="fas fa-certificate",
                link="https://example.com/cert1"
            ),
            Certification(
                title="UI/UX Design Essentials",
                provider="Design Academy",
                year="2021",
                icon="fas fa-certificate",
                link="https://example.com/cert2"
            ),
            Certification(
                title="React & Redux Mastery",
                provider="Online Learning Platform",
                year="2020",
                icon="fas fa-certificate",
                link="https://example.com/cert3"
            ),
            Certification(
                title="Advanced JavaScript",
                provider="JavaScript Institute",
                year="2019",
                icon="fas fa-certificate",
                link="https://example.com/cert4"
            ),
            Certification(
                title="AWS Certified Developer",
                provider="Amazon Web Services",
                year="2023",
                icon="fas fa-award",
                link="https://example.com/cert5"
            ),
            Certification(
                title="Google Professional Cloud Developer",
                provider="Google Cloud",
                year="2023",
                icon="fas fa-award",
                link="https://example.com/cert6"
            )
        ]
        
        for cert in initial_certifications:
            db.session.add(cert)
        
        db.session.commit()

@app.route('/')
def index():
    # Fetch skills from the database
    technical_skills = Skill.query.filter_by(category="technical").all()
    soft_skills = Skill.query.filter_by(category="soft").all()
    tools_skills = Skill.query.filter_by(category="tools").all()
    
    # Fetch projects from the database
    projects = Project.query.all()
    
    # Fetch certifications from the database
    certifications = Certification.query.all()
    
    return render_template('index.html', 
                          technical_skills=technical_skills,
                          soft_skills=soft_skills,
                          tools_skills=tools_skills,
                          projects=projects,
                          certifications=certifications)

@app.route('/submit_contact', methods=['POST'])
def submit_contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        subject = request.form.get('subject')
        message = request.form.get('message')
        
        # Log the form submission
        app.logger.info(f"Contact form submission from {name} ({email})")
        
        try:
            # Here you would typically send an email
            # For now, we'll just log it
            app.logger.info(f"Would send email: Subject: {subject}, From: {email}, Message: {message}")
            
            flash("Your message has been sent. Thank you!", "success")
        except Exception as e:
            app.logger.error(f"Error sending message: {e}")
            flash("Sorry, there was an error sending your message.", "error")
        
        return redirect(url_for('index', _anchor='contact'))
    
    return redirect(url_for('index'))

# Skill management routes
@app.route('/skill/add', methods=['POST'])
def add_skill():
    try:
        data = request.get_json()
        
        name = data.get('name')
        icon = data.get('icon')
        category = data.get('category')
        proficiency = data.get('proficiency', 0)
        
        if not all([name, icon, category]):
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400
        
        # Create new skill
        new_skill = Skill(
            name=name,
            icon=icon,
            category=category,
            proficiency=proficiency
        )
        
        db.session.add(new_skill)
        db.session.commit()
        
        return jsonify({
            'success': True, 
            'message': 'Skill added successfully',
            'skill': new_skill.to_dict()
        })
    except Exception as e:
        app.logger.error(f"Error adding skill: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/skill/delete/<int:skill_id>', methods=['DELETE'])
def delete_skill(skill_id):
    try:
        skill = Skill.query.get(skill_id)
        
        if not skill:
            return jsonify({'success': False, 'message': 'Skill not found'}), 404
        
        db.session.delete(skill)
        db.session.commit()
        
        return jsonify({
            'success': True, 
            'message': 'Skill deleted successfully'
        })
    except Exception as e:
        app.logger.error(f"Error deleting skill: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500

# Project management routes
@app.route('/project/add', methods=['POST'])
def add_project():
    try:
        data = request.get_json()
        
        title = data.get('title')
        description = data.get('description')
        icon = data.get('icon')
        category = data.get('category')
        live_link = data.get('live_link')
        code_link = data.get('code_link')
        tags = data.get('tags', [])
        
        if not all([title, description, icon, category]):
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400
        
        # Convert tags list to comma-separated string if it's a list
        if isinstance(tags, list):
            tags = ','.join(tags)
        
        # Create new project
        new_project = Project(
            title=title,
            description=description,
            icon=icon,
            category=category,
            live_link=live_link,
            code_link=code_link,
            tags=tags
        )
        
        db.session.add(new_project)
        db.session.commit()
        
        return jsonify({
            'success': True, 
            'message': 'Project added successfully',
            'project': new_project.to_dict()
        })
    except Exception as e:
        app.logger.error(f"Error adding project: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/project/delete/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    try:
        project = Project.query.get(project_id)
        
        if not project:
            return jsonify({'success': False, 'message': 'Project not found'}), 404
        
        db.session.delete(project)
        db.session.commit()
        
        return jsonify({
            'success': True, 
            'message': 'Project deleted successfully'
        })
    except Exception as e:
        app.logger.error(f"Error deleting project: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500

# Certification management routes
@app.route('/certification/add', methods=['POST'])
def add_certification():
    try:
        data = request.get_json()
        
        title = data.get('title')
        provider = data.get('provider')
        year = data.get('year')
        icon = data.get('icon')
        link = data.get('link')
        
        if not all([title, provider, year, icon]):
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400
        
        # Create new certification
        new_cert = Certification(
            title=title,
            provider=provider,
            year=year,
            icon=icon,
            link=link
        )
        
        db.session.add(new_cert)
        db.session.commit()
        
        return jsonify({
            'success': True, 
            'message': 'Certification added successfully',
            'certification': new_cert.to_dict()
        })
    except Exception as e:
        app.logger.error(f"Error adding certification: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/certification/delete/<int:cert_id>', methods=['DELETE'])
def delete_certification(cert_id):
    try:
        cert = Certification.query.get(cert_id)
        
        if not cert:
            return jsonify({'success': False, 'message': 'Certification not found'}), 404
        
        db.session.delete(cert)
        db.session.commit()
        
        return jsonify({
            'success': True, 
            'message': 'Certification deleted successfully'
        })
    except Exception as e:
        app.logger.error(f"Error deleting certification: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)