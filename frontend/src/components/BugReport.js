import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

const BugReport = () => {
  const [bugReports, setBugReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bug_type: 'bug',
    priority: 'medium',
    reporter_email: '',
    reporter_name: '',
    steps_to_reproduce: '',
    expected_behavior: '',
    actual_behavior: '',
    environment: '',
    browser_info: '',
    device_info: ''
  });

  // Load bug reports
  const loadBugReports = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bugs');
      const data = await response.json();
      setBugReports(data);
    } catch (error) {
      console.error('Error loading bug reports:', error);
      toast.error('Failed to load bug reports');
    } finally {
      setLoading(false);
    }
  };

  // Submit bug report
  const submitBugReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/bugs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast.success('Bug report submitted successfully!');
        setShowForm(false);
        setFormData({
          title: '',
          description: '',
          bug_type: 'bug',
          priority: 'medium',
          reporter_email: '',
          reporter_name: '',
          steps_to_reproduce: '',
          expected_behavior: '',
          actual_behavior: '',
          environment: '',
          browser_info: '',
          device_info: ''
        });
        loadBugReports();
      } else {
        throw new Error('Failed to submit bug report');
      }
    } catch (error) {
      console.error('Error submitting bug report:', error);
      toast.error('Failed to submit bug report');
    } finally {
      setLoading(false);
    }
  };

  // Add comment to bug report
  const addComment = async (bugId, comment) => {
    try {
      const response = await fetch(`/api/bugs/${bugId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bug_id: bugId,
          author_email: formData.reporter_email,
          author_name: formData.reporter_name,
          comment: comment,
          is_internal: false
        })
      });
      
      if (response.ok) {
        toast.success('Comment added successfully!');
        loadBugReports();
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  useEffect(() => {
    loadBugReports();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'reopened': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">🐛 Bug Reports & Requests</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Report New Issue'}
        </Button>
      </div>

      {/* Bug Report Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Report a Bug or Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitBugReport} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Brief description of the issue"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Type *</label>
                  <Select 
                    value={formData.bug_type} 
                    onValueChange={(value) => setFormData({...formData, bug_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug">Bug</SelectItem>
                      <SelectItem value="feature_request">Feature Request</SelectItem>
                      <SelectItem value="improvement">Improvement</SelectItem>
                      <SelectItem value="question">Question</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description *</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed description of the issue or request"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value) => setFormData({...formData, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Your Email *</label>
                  <Input
                    type="email"
                    value={formData.reporter_email}
                    onChange={(e) => setFormData({...formData, reporter_email: e.target.value})}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Your Name</label>
                <Input
                  value={formData.reporter_name}
                  onChange={(e) => setFormData({...formData, reporter_name: e.target.value})}
                  placeholder="Your name (optional)"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Steps to Reproduce</label>
                <Textarea
                  value={formData.steps_to_reproduce}
                  onChange={(e) => setFormData({...formData, steps_to_reproduce: e.target.value})}
                  placeholder="1. Go to... 2. Click on... 3. See error..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Expected Behavior</label>
                  <Textarea
                    value={formData.expected_behavior}
                    onChange={(e) => setFormData({...formData, expected_behavior: e.target.value})}
                    placeholder="What should happen?"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Actual Behavior</label>
                  <Textarea
                    value={formData.actual_behavior}
                    onChange={(e) => setFormData({...formData, actual_behavior: e.target.value})}
                    placeholder="What actually happens?"
                    rows={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Environment</label>
                  <Input
                    value={formData.environment}
                    onChange={(e) => setFormData({...formData, environment: e.target.value})}
                    placeholder="Windows 10, macOS, etc."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Browser</label>
                  <Input
                    value={formData.browser_info}
                    onChange={(e) => setFormData({...formData, browser_info: e.target.value})}
                    placeholder="Chrome, Safari, etc."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Device</label>
                  <Input
                    value={formData.device_info}
                    onChange={(e) => setFormData({...formData, device_info: e.target.value})}
                    placeholder="iPhone, Android, Desktop, etc."
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Report'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Bug Reports List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Your Reports</h3>
        
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : bugReports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No bug reports yet. Click "Report New Issue" to get started!
          </div>
        ) : (
          <div className="space-y-4">
            {bugReports.map((report) => (
              <Card key={report.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{report.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        #{report.id} • {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(report.status)}>
                        {report.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge className={getPriorityColor(report.priority)}>
                        {report.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-3">{report.description}</p>
                  
                  <div className="text-xs text-muted-foreground">
                    Type: {report.bug_type.replace('_', ' ').toUpperCase()} • 
                    Priority: {report.priority.toUpperCase()} • 
                    Status: {report.status.replace('_', ' ').toUpperCase()}
                  </div>
                  
                  {report.comments && report.comments.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <h5 className="text-sm font-medium mb-2">Comments:</h5>
                      {report.comments.map((comment) => (
                        <div key={comment.id} className="text-sm mb-2 p-2 bg-gray-50 rounded">
                          <div className="font-medium">{comment.author_name}</div>
                          <div className="text-muted-foreground">{comment.comment}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(comment.created_at).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BugReport;


