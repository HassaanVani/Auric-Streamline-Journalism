import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Plus,
    MapPin,
    ChevronRight,
    Sparkles,
    Filter
} from 'lucide-react';

const contacts = [
    {
        id: 1,
        name: 'Dr. Sarah Chen',
        role: 'Climate Scientist',
        org: 'UC Berkeley',
        location: 'Berkeley, CA',
        initials: 'SC',
        expertise: ['Climate Policy', 'Cap-and-Trade'],
        status: 'confirmed',
        match: 95,
    },
    {
        id: 2,
        name: 'Mayor James Wilson',
        role: 'Mayor',
        org: 'City of Oakland',
        location: 'Oakland, CA',
        initials: 'JW',
        expertise: ['Local Government', 'Urban Policy'],
        status: 'pending',
        match: 88,
    },
    {
        id: 3,
        name: 'Lisa Martinez',
        role: 'Community Organizer',
        org: 'Bay Area Climate Coalition',
        location: 'San Francisco, CA',
        initials: 'LM',
        expertise: ['Grassroots Organizing'],
        status: 'scheduled',
        match: 82,
    },
];

const suggestions = [
    { name: 'State Senator Alex Rivera', role: 'CA State Senate', match: 92 },
    { name: 'EPA Regional Director', role: 'US EPA Region 9', match: 87 },
];

export function Contacts() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="page-container">
            {/* Header */}
            <header className="page-header">
                <h1 className="text-h1" style={{ marginBottom: '0.5rem' }}>Sources & Contacts</h1>
                <p className="text-body" style={{ maxWidth: '480px' }}>
                    Manage your network of sources, experts, and key contacts.
                </p>
            </header>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                    <Search style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '18px',
                        height: '18px',
                        color: 'var(--text-dim)'
                    }} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search sources..."
                        className="input"
                        style={{ paddingLeft: '3rem' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-secondary">
                        <Filter style={{ width: '16px', height: '16px' }} />
                        Filter
                    </button>
                    <button className="btn btn-primary">
                        <Plus style={{ width: '16px', height: '16px' }} />
                        Add Contact
                    </button>
                </div>
            </div>

            <div className="grid-main">
                {/* Contacts List */}
                <div>
                    {contacts.map((contact) => (
                        <Link key={contact.id} to={`/contacts/${contact.id}`} style={{ textDecoration: 'none' }}>
                            <div className="list-item card-interactive" style={{ marginBottom: '1rem' }}>
                                <div className="avatar-lg">{contact.initials}</div>

                                <div className="list-item-content">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
                                        <span className="list-item-title">{contact.name}</span>
                                        <span className="badge badge-gold">{contact.match}%</span>
                                        {contact.status && (
                                            <span className={`badge ${contact.status === 'confirmed' ? 'badge-success' :
                                                    contact.status === 'pending' ? 'badge-warning' : 'badge-info'
                                                }`}>
                                                {contact.status}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-small" style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                        {contact.role} at {contact.org}
                                    </p>

                                    <div className="list-item-meta">
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                            <MapPin style={{ width: '14px', height: '14px' }} />
                                            {contact.location}
                                        </span>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {contact.expertise.map((exp) => (
                                                <span key={exp} className="badge">{exp}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <ChevronRight style={{ width: '20px', height: '20px', color: 'var(--text-dim)', flexShrink: 0 }} />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Sidebar */}
                <div className="grid-sidebar">
                    {/* AI Suggestions */}
                    <div className="panel panel-gold">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Sparkles style={{ width: '16px', height: '16px', color: 'var(--gold)' }} />
                            <p className="text-label text-gold">SUGGESTED SOURCES</p>
                        </div>

                        <p className="text-small" style={{ marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
                            Based on your climate policy story
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {suggestions.map((s, i) => (
                                <div key={i} className="card" style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                                {s.name}
                                            </p>
                                            <p className="text-small">{s.role}</p>
                                        </div>
                                        <span className="text-small text-gold" style={{ fontWeight: 600 }}>{s.match}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>
                            View All
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="card">
                        <p className="text-label" style={{ marginBottom: '1rem' }}>STORY SOURCES</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                { label: 'Total identified', value: '12' },
                                { label: 'Contacted', value: '4' },
                                { label: 'Confirmed', value: '2', color: 'var(--success)' },
                                { label: 'Pending', value: '2', color: 'var(--warning)' },
                            ].map((stat) => (
                                <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span className="text-small">{stat.label}</span>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: stat.color || 'var(--text-primary)' }}>
                                        {stat.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contacts;
