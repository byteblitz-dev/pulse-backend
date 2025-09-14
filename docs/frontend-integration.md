# 📱 Frontend Integration Guide

Complete integration examples for Flutter mobile apps and React/Next.js web dashboards.

## Mobile App Integration (Flutter)

### Base Configuration

```dart
// config/api_config.dart
class ApiConfig {
  static const String baseUrl = 'http://localhost:4000'; // Development
  // static const String baseUrl = 'https://backend-production-e915.up.railway.app'; // Production
  
  static const Map<String, String> headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}
```

### Authentication Service

```dart
// services/auth_service.dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class AuthService {
  static String? _token;
  
  // Athlete Registration
  static Future<Map<String, dynamic>> registerAthlete({
    required String name,
    required String email,
    required String password,
    int? age,
  }) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/auth/athlete/signup'),
      headers: ApiConfig.headers,
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
        if (age != null) 'age': age,
      }),
    );
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Registration failed: ${response.body}');
    }
  }
  
  // Athlete Login
  static Future<String> loginAthlete({
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/auth/athlete/signin'),
      headers: ApiConfig.headers,
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );
    
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      _token = data['token'];
      return _token!;
    } else {
      throw Exception('Login failed: ${response.body}');
    }
  }
  
  // Get auth headers
  static Map<String, String> getAuthHeaders() {
    return {
      ...ApiConfig.headers,
      'Authorization': 'Bearer $_token',
    };
  }
}
```

### Data Service

```dart
// services/data_service.dart
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'auth_service.dart';

class DataService {
  // Store Test Result
  static Future<Map<String, dynamic>> storeTestResult({
    required String testType,
    required Map<String, dynamic> metrics,
  }) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/data/store'),
      headers: AuthService.getAuthHeaders(),
      body: jsonEncode({
        'testType': testType,
        'metrics': metrics,
      }),
    );
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to store result: ${response.body}');
    }
  }
  
  // Get My Results
  static Future<List<Map<String, dynamic>>> getMyResults() async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/data/my-results'),
      headers: AuthService.getAuthHeaders(),
    );
    
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return List<Map<String, dynamic>>.from(data['results']);
    } else {
      throw Exception('Failed to fetch results: ${response.body}');
    }
  }
}
```

### Feedback Service

```dart
// services/feedback_service.dart
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'auth_service.dart';

class FeedbackService {
  // Get AI Feedback
  static Future<String> getFeedback({
    required Map<String, dynamic> performanceData,
  }) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/feedback'),
      headers: AuthService.getAuthHeaders(),
      body: jsonEncode({
        'performanceData': performanceData,
      }),
    );
    
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['feedback'];
    } else {
      throw Exception('Failed to get feedback: ${response.body}');
    }
  }
}
```

### Usage Example in Flutter

```dart
// screens/test_screen.dart
import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../services/data_service.dart';
import '../services/feedback_service.dart';

class TestScreen extends StatefulWidget {
  @override
  _TestScreenState createState() => _TestScreenState();
}

class _TestScreenState extends State<TestScreen> {
  bool _isLoading = false;
  String? _feedback;
  
  // Example: Store Vertical Jump Test
  Future<void> _storeVerticalJumpTest() async {
    setState(() => _isLoading = true);
    
    try {
      // Store the test result
      await DataService.storeTestResult(
        testType: 'vertical_jump',
        metrics: {
          'height': 45.2,
          'confidence': 0.95,
          'timestamp': DateTime.now().toIso8601String(),
          'attempts': 3,
          'bestAttempt': 1,
        },
      );
      
      // Get AI feedback
      final feedback = await FeedbackService.getFeedback(
        performanceData: {
          'testType': 'vertical_jump',
          'metrics': {
            'height': 45.2,
            'previousBest': 42.1,
            'improvement': 7.4,
            'confidence': 0.95,
          },
        },
      );
      
      setState(() {
        _feedback = feedback;
        _isLoading = false;
      });
      
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Performance Test')),
      body: Column(
        children: [
          ElevatedButton(
            onPressed: _isLoading ? null : _storeVerticalJumpTest,
            child: _isLoading 
              ? CircularProgressIndicator() 
              : Text('Perform Vertical Jump Test'),
          ),
          if (_feedback != null)
            Padding(
              padding: EdgeInsets.all(16),
              child: Text(_feedback!),
            ),
        ],
      ),
    );
  }
}
```

## Web Dashboard Integration (React/Next.js)

### Base Configuration

```typescript
// config/api.ts
export const API_CONFIG = {
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://backend-production-e915.up.railway.app'
    : 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

### Authentication Service

```typescript
// services/authService.ts
import { API_CONFIG, ApiResponse } from '../config/api';

class AuthService {
  private static token: string | null = null;
  
  // Official Login
  static async loginOfficial(email: string, password: string): Promise<string> {
    const response = await fetch(`${API_CONFIG.baseUrl}/auth/official/signin`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    const data = await response.json();
    this.token = data.token;
    localStorage.setItem('official_token', data.token);
    return data.token;
  }
  
  // Get auth headers
  static getAuthHeaders(): HeadersInit {
    return {
      ...API_CONFIG.headers,
      'Authorization': `Bearer ${this.token || localStorage.getItem('official_token')}`,
    };
  }
  
  // Logout
  static logout(): void {
    this.token = null;
    localStorage.removeItem('official_token');
  }
}

export default AuthService;
```

### Data Service

```typescript
// services/dataService.ts
import { API_CONFIG } from '../config/api';
import AuthService from './authService';

export interface TestResult {
  id: string;
  testType: string;
  metrics: Record<string, any>;
  createdAt: string;
  session: {
    id: string;
    athleteId: string;
    athlete?: {
      id: string;
      name: string;
      email: string;
      age?: number;
    };
  };
}

class DataService {
  // Get All Results
  static async getAllResults(): Promise<TestResult[]> {
    const response = await fetch(`${API_CONFIG.baseUrl}/data/all`, {
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch results');
    }
    
    const data = await response.json();
    return data.results;
  }
  
  // Get Athlete Results
  static async getAthleteResults(athleteId: string): Promise<TestResult[]> {
    const response = await fetch(`${API_CONFIG.baseUrl}/data/athlete/${athleteId}`, {
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch athlete results');
    }
    
    const data = await response.json();
    return data.results;
  }
}

export default DataService;
```

### Feedback Service

```typescript
// services/feedbackService.ts
import { API_CONFIG } from '../config/api';
import AuthService from './authService';

class FeedbackService {
  // Get Official Feedback
  static async getOfficialFeedback(performanceData: Record<string, any>): Promise<string> {
    const response = await fetch(`${API_CONFIG.baseUrl}/feedback`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify({ performanceData }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get feedback');
    }
    
    const data = await response.json();
    return data.feedback;
  }
}

export default FeedbackService;
```

### React Component Example

```tsx
// components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import DataService, { TestResult } from '../services/dataService';
import FeedbackService from '../services/feedbackService';
import AuthService from '../services/authService';

const Dashboard: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string>('');
  
  useEffect(() => {
    loadResults();
  }, []);
  
  const loadResults = async () => {
    try {
      setLoading(true);
      const data = await DataService.getAllResults();
      setResults(data);
    } catch (error) {
      console.error('Failed to load results:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getFeedback = async (result: TestResult) => {
    try {
      const feedbackText = await FeedbackService.getOfficialFeedback({
        testType: result.testType,
        metrics: {
          ...result.metrics,
          athleteName: result.session.athlete?.name,
          athleteAge: result.session.athlete?.age,
        },
      });
      setFeedback(feedbackText);
    } catch (error) {
      console.error('Failed to get feedback:', error);
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="dashboard">
      <h1>Performance Dashboard</h1>
      
      <div className="results-grid">
        {results.map((result) => (
          <div key={result.id} className="result-card">
            <h3>{result.testType.replace('_', ' ').toUpperCase()}</h3>
            <p>Athlete: {result.session.athlete?.name}</p>
            <p>Date: {new Date(result.createdAt).toLocaleDateString()}</p>
            <button onClick={() => getFeedback(result)}>
              Get AI Feedback
            </button>
          </div>
        ))}
      </div>
      
      {feedback && (
        <div className="feedback-section">
          <h3>AI Feedback</h3>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
```

## Environment Configuration

### Development Environment

```bash
# .env.development
REACT_APP_API_URL=http://localhost:4000
FLUTTER_API_URL=http://localhost:4000
```

### Production Environment

```bash
# .env.production
REACT_APP_API_URL=https://backend-production-e915.up.railway.app
FLUTTER_API_URL=https://backend-production-e915.up.railway.app
```

## Error Handling Best Practices

### Flutter Error Handling

```dart
// utils/error_handler.dart
class ApiErrorHandler {
  static String handleError(dynamic error) {
    if (error is http.Response) {
      switch (error.statusCode) {
        case 401:
          return 'Authentication failed. Please login again.';
        case 403:
          return 'Access denied. You do not have permission.';
        case 404:
          return 'Resource not found.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return 'An error occurred: ${error.body}';
      }
    }
    return 'Network error. Please check your connection.';
  }
}
```

### React Error Handling

```typescript
// utils/errorHandler.ts
export const handleApiError = (error: any): string => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        AuthService.logout();
        return 'Session expired. Please login again.';
      case 403:
        return 'Access denied. You do not have permission.';
      case 404:
        return 'Resource not found.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return error.response.data?.message || 'An error occurred';
    }
  }
  return 'Network error. Please check your connection.';
};
```

## CORS Configuration

The backend is configured to accept requests from:

- **Development**: 
  - `http://localhost:3000` (React/Next.js)
  - `http://localhost:3001` (Alternative port)
  - Mobile app (localhost for testing)

- **Production**: 
  - Your frontend domain (set via `FRONTEND_URL` environment variable)
  - Mobile app (production domain)

## Authentication Flow

### Mobile App (Athletes)
1. **Register/Login** → Get JWT token
2. **Store token** in secure storage
3. **Include token** in all API requests
4. **Handle token expiration** (1 hour)

### Web Dashboard (Officials)
1. **Login** → Get JWT token
2. **Store token** in localStorage
3. **Include token** in all API requests
4. **Auto-logout** on token expiration

## Rate Limiting & Best Practices

- **Request Frequency**: Avoid rapid successive requests
- **Error Handling**: Always handle network errors gracefully
- **Token Management**: Store tokens securely and handle expiration
- **Loading States**: Show loading indicators during API calls
- **Offline Support**: Consider offline functionality for mobile app