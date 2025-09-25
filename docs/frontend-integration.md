# Frontend Integration Guide

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
    required String firstName,
    required String lastName,
    required String email,
    required String phone,
    required DateTime dateOfBirth,
    required int age,
    required String gender,
    required String sport,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/athlete/signup'),
      headers: ApiConfig.headers,
      body: jsonEncode({
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'phone': phone,
        'dateOfBirth': dateOfBirth.toIso8601String(),
        'age': age,
        'gender': gender,
        'sport': sport,
        'password': password,
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
      Uri.parse('${ApiConfig.baseUrl}/athlete/signin'),
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

### Test Data Service

```dart
// services/test_service.dart
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'auth_service.dart';

class TestService {
  // Store Standardized Test
  static Future<Map<String, dynamic>> storeStandardizedTest({
    required DateTime testDate,
    required double height,
    required double weight,
    required Map<String, dynamic> sitAndReach,
    required Map<String, dynamic> standingVerticalJump,
    required Map<String, dynamic> standingBroadJump,
    required Map<String, dynamic> medicineBallThrow,
    required Map<String, dynamic> sprint30m,
    required Map<String, dynamic> shuttleRun4x10m,
    required Map<String, dynamic> situps,
    Map<String, dynamic>? run800m,
    Map<String, dynamic>? run1600m,
  }) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/athlete/tests/standardized'),
      headers: AuthService.getAuthHeaders(),
      body: jsonEncode({
        'testDate': testDate.toIso8601String(),
        'height': height,
        'weight': weight,
        'sitAndReach': sitAndReach,
        'standingVerticalJump': standingVerticalJump,
        'standingBroadJump': standingBroadJump,
        'medicineBallThrow': medicineBallThrow,
        'sprint30m': sprint30m,
        'shuttleRun4x10m': shuttleRun4x10m,
        'situps': situps,
        if (run800m != null) 'run800m': run800m,
        if (run1600m != null) 'run1600m': run1600m,
      }),
    );
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to store standardized test: ${response.body}');
    }
  }
  
  // Store Psychological Assessment
  static Future<Map<String, dynamic>> storePsychologicalAssessment({
    required DateTime assessmentDate,
    required Map<String, dynamic> mentalToughness,
    required Map<String, dynamic> competitiveAnxiety,
    required Map<String, dynamic> teamCohesion,
    required Map<String, dynamic> mentalHealth,
    required Map<String, dynamic> personalityTraits,
    required Map<String, dynamic> motivationGoals,
    required Map<String, dynamic> stressCoping,
    required Map<String, dynamic> healthScreening,
    required Map<String, dynamic> imageryAbility,
    required Map<String, dynamic> reactionTime,
    required Map<String, dynamic> determination,
    required Map<String, dynamic> timeAnticipation,
    required Map<String, dynamic> peripheralVision,
    required Map<String, dynamic> attentionAlertness,
    required Map<String, dynamic> sensorimotorTasks,
    required Map<String, dynamic> balanceTests,
    required Map<String, dynamic> psychomotorTasks,
    required Map<String, dynamic> cognitiveTasks,
    required Map<String, dynamic> performanceConsistency,
  }) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/athlete/tests/psychological'),
      headers: AuthService.getAuthHeaders(),
      body: jsonEncode({
        'assessmentDate': assessmentDate.toIso8601String(),
        'mentalToughness': mentalToughness,
        'competitiveAnxiety': competitiveAnxiety,
        'teamCohesion': teamCohesion,
        'mentalHealth': mentalHealth,
        'personalityTraits': personalityTraits,
        'motivationGoals': motivationGoals,
        'stressCoping': stressCoping,
        'healthScreening': healthScreening,
        'imageryAbility': imageryAbility,
        'reactionTime': reactionTime,
        'determination': determination,
        'timeAnticipation': timeAnticipation,
        'peripheralVision': peripheralVision,
        'attentionAlertness': attentionAlertness,
        'sensorimotorTasks': sensorimotorTasks,
        'balanceTests': balanceTests,
        'psychomotorTasks': psychomotorTasks,
        'cognitiveTasks': cognitiveTasks,
        'performanceConsistency': performanceConsistency,
      }),
    );
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to store psychological assessment: ${response.body}');
    }
  }
  
  // Store Sport-Specific Test
  static Future<Map<String, dynamic>> storeSportSpecificTest({
    required DateTime testDate,
    required Map<String, dynamic> testResults,
  }) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/athlete/tests/sport-specific'),
      headers: AuthService.getAuthHeaders(),
      body: jsonEncode({
        'testDate': testDate.toIso8601String(),
        'testResults': testResults,
      }),
    );
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to store sport-specific test: ${response.body}');
    }
  }
  
  // Get Test History
  static Future<Map<String, dynamic>> getTestHistory() async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/athlete/tests/history'),
      headers: AuthService.getAuthHeaders(),
    );
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to fetch test history: ${response.body}');
    }
  }
}
```

### Leaderboard Service

```dart
// services/leaderboard_service.dart
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'auth_service.dart';

class LeaderboardService {
  // Get Leaderboard
  static Future<Map<String, dynamic>> getLeaderboard() async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/athlete/leaderboard'),
      headers: AuthService.getAuthHeaders(),
    );
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to fetch leaderboard: ${response.body}');
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
  static Future<Map<String, dynamic>> getFeedback() async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}/athlete/feedback'),
      headers: AuthService.getAuthHeaders(),
    );
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
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
import '../services/test_service.dart';
import '../services/feedback_service.dart';

class TestScreen extends StatefulWidget {
  @override
  _TestScreenState createState() => _TestScreenState();
}

class _TestScreenState extends State<TestScreen> {
  bool _isLoading = false;
  Map<String, dynamic>? _feedback;
  
  // Example: Store Standardized Test
  Future<void> _storeStandardizedTest() async {
    setState(() => _isLoading = true);
    
    try {
      await TestService.storeStandardizedTest(
        testDate: DateTime.now(),
        height: 180.5,
        weight: 75.2,
        sitAndReach: {
          'value': 25.5,
          'unit': 'cm'
        },
        standingVerticalJump: {
          'value': 45.2,
          'unit': 'cm'
        },
        standingBroadJump: {
          'value': 2.8,
          'unit': 'm'
        },
        medicineBallThrow: {
          'value': 8.5,
          'unit': 'm'
        },
        sprint30m: {
          'value': 4.2,
          'unit': 'seconds'
        },
        shuttleRun4x10m: {
          'value': 12.5,
          'unit': 'seconds'
        },
        situps: {
          'count': 45,
          'time': 60,
          'unit': 'seconds'
        },
        run800m: {
          'value': 180.5,
          'unit': 'seconds'
        },
      );
      
      // Get AI feedback
      final feedback = await FeedbackService.getFeedback();
      
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
            onPressed: _isLoading ? null : _storeStandardizedTest,
            child: _isLoading 
              ? CircularProgressIndicator() 
              : Text('Perform Standardized Test'),
          ),
          if (_feedback != null)
            Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('AI Feedback Report', style: TextStyle(fontWeight: FontWeight.bold)),
                  Text('Overall Score: ${_feedback!['report']['overallScore']}'),
                  Text('Strengths: ${_feedback!['report']['strengths'].join(', ')}'),
                  Text('Recommendations: ${_feedback!['report']['recommendations'].join(', ')}'),
                ],
              ),
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

// Sport and Gender enums
export enum Sport {
  ARCHERY = 'ARCHERY',
  ATHLETICS = 'ATHLETICS',
  BOXING = 'BOXING',
  CYCLING = 'CYCLING',
  FENCING = 'FENCING',
  HOCKEY = 'HOCKEY',
  JUDO = 'JUDO',
  ROWING = 'ROWING',
  SWIMMING = 'SWIMMING',
  SHOOTING = 'SHOOTING',
  TABLE_TENNIS = 'TABLE_TENNIS',
  WEIGHTLIFTING = 'WEIGHTLIFTING',
  WRESTLING = 'WRESTLING'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}
```

### Authentication Service

```typescript
// services/authService.ts
import { API_CONFIG, ApiResponse } from '../config/api';

class AuthService {
  private static token: string | null = null;
  
  // Official Registration
  static async registerOfficial({
    firstName,
    lastName,
    email,
    phone,
    gender,
    sport,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    sport: string;
    password: string;
  }): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_CONFIG.baseUrl}/official/signup`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        gender,
        sport,
        password,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return await response.json();
  }
  
  // Official Login
  static async loginOfficial(email: string, password: string): Promise<string> {
    const response = await fetch(`${API_CONFIG.baseUrl}/official/signin`, {
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

### Athlete Management Service

```typescript
// services/athleteService.ts
import { API_CONFIG } from '../config/api';
import AuthService from './authService';

export interface Athlete {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  sport: string;
  createdAt: string;
}

export interface TestHistory {
  standardized: {
    count: number;
    latest: any;
    all: any[];
  };
  psychological: {
    count: number;
    latest: any;
    all: any[];
  };
  sportSpecific: {
    count: number;
    latest: any;
    all: any[];
  };
}

class AthleteService {
  // Get All Athletes in Sport
  static async getAllAthletes(): Promise<Athlete[]> {
    const response = await fetch(`${API_CONFIG.baseUrl}/official/athletes`, {
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch athletes');
    }
    
    const data = await response.json();
    return data.athletes;
  }
  
  // Get All Test Results
  static async getAllTestResults(): Promise<any> {
    const response = await fetch(`${API_CONFIG.baseUrl}/official/athletes/tests`, {
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch test results');
    }
    
    return await response.json();
  }
  
  // Get Athlete Test History
  static async getAthleteTestHistory(athleteId: string): Promise<TestHistory> {
    const response = await fetch(`${API_CONFIG.baseUrl}/official/athletes/${athleteId}/tests`, {
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch athlete test history');
    }
    
    const data = await response.json();
    return data.testHistory;
  }
}

export default AthleteService;
```

### Leaderboard Service

```typescript
// services/leaderboardService.ts
import { API_CONFIG } from '../config/api';
import AuthService from './authService';

export interface LeaderboardEntry {
  athleteId: string;
  firstName: string;
  lastName: string;
  sport: string;
  standardizedScore: number;
  psychologicalScore: number;
  sportSpecificScore: number;
  overallScore: number;
  rank: number;
  totalTests: number;
}

export interface LeaderboardCategory {
  category: string;
  entries: LeaderboardEntry[];
}

class LeaderboardService {
  // Get Leaderboard
  static async getLeaderboard(): Promise<LeaderboardCategory[]> {
    const response = await fetch(`${API_CONFIG.baseUrl}/official/leaderboard`, {
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch leaderboard');
    }
    
    const data = await response.json();
    return data.leaderboard;
  }
}

export default LeaderboardService;
```

### Feedback Service

```typescript
// services/feedbackService.ts
import { API_CONFIG } from '../config/api';
import AuthService from './authService';

export interface AIFeedbackReport {
  athleteId: string;
  athleteName: string;
  sport: string;
  reportDate: string;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  performanceTrends: {
    standardized: string;
    psychological: string;
    sportSpecific: string;
  };
  detailedAnalysis: {
    standardized: {
      score: number;
      analysis: string;
      keyMetrics: Record<string, any>;
    };
    psychological: {
      score: number;
      analysis: string;
      keyMetrics: Record<string, any>;
    };
    sportSpecific: {
      score: number;
      analysis: string;
      keyMetrics: Record<string, any>;
    };
  };
  nextSteps: string[];
  motivationalMessage: string;
}

class FeedbackService {
  // Get AI Feedback for Specific Athlete
  static async getAthleteFeedback(athleteId: string): Promise<AIFeedbackReport> {
    const response = await fetch(`${API_CONFIG.baseUrl}/official/athletes/${athleteId}/feedback`, {
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get athlete feedback');
    }
    
    const data = await response.json();
    return data.report;
  }
  
  // Get AI Feedback for All Athletes
  static async getAllAthletesFeedback(): Promise<AIFeedbackReport[]> {
    const response = await fetch(`${API_CONFIG.baseUrl}/official/athletes/feedback`, {
      headers: AuthService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get all athletes feedback');
    }
    
    const data = await response.json();
    return data.reports;
  }
}

export default FeedbackService;
```

### React Component Example

```tsx
// components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import AthleteService, { Athlete } from '../services/athleteService';
import LeaderboardService, { LeaderboardCategory } from '../services/leaderboardService';
import FeedbackService, { AIFeedbackReport } from '../services/feedbackService';
import AuthService from '../services/authService';

const Dashboard: React.FC = () => {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardCategory[]>([]);
  const [feedback, setFeedback] = useState<AIFeedbackReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'athletes' | 'leaderboard' | 'feedback'>('athletes');
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setLoading(true);
      const [athletesData, leaderboardData] = await Promise.all([
        AthleteService.getAllAthletes(),
        LeaderboardService.getLeaderboard(),
      ]);
      setAthletes(athletesData);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadFeedback = async () => {
    try {
      setLoading(true);
      const feedbackData = await FeedbackService.getAllAthletesFeedback();
      setFeedback(feedbackData);
    } catch (error) {
      console.error('Failed to load feedback:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="dashboard">
      <h1>Performance Dashboard</h1>
      
      <div className="tabs">
        <button 
          className={activeTab === 'athletes' ? 'active' : ''}
          onClick={() => setActiveTab('athletes')}
        >
          Athletes
        </button>
        <button 
          className={activeTab === 'leaderboard' ? 'active' : ''}
          onClick={() => setActiveTab('leaderboard')}
        >
          Leaderboard
        </button>
        <button 
          className={activeTab === 'feedback' ? 'active' : ''}
          onClick={() => {
            setActiveTab('feedback');
            loadFeedback();
          }}
        >
          AI Feedback
        </button>
      </div>
      
      {activeTab === 'athletes' && (
        <div className="athletes-section">
          <h2>Athletes ({athletes.length})</h2>
          <div className="athletes-grid">
            {athletes.map((athlete) => (
              <div key={athlete.id} className="athlete-card">
                <h3>{athlete.firstName} {athlete.lastName}</h3>
                <p>Email: {athlete.email}</p>
                <p>Sport: {athlete.sport}</p>
                <p>Age: {athlete.age}</p>
                <p>Gender: {athlete.gender}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'leaderboard' && (
        <div className="leaderboard-section">
          <h2>Leaderboard</h2>
          {leaderboard.map((category) => (
            <div key={category.category} className="leaderboard-category">
              <h3>{category.category.toUpperCase()}</h3>
              <div className="leaderboard-entries">
                {category.entries.map((entry) => (
                  <div key={entry.athleteId} className="leaderboard-entry">
                    <span className="rank">#{entry.rank}</span>
                    <span className="name">{entry.firstName} {entry.lastName}</span>
                    <span className="score">{entry.overallScore.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {activeTab === 'feedback' && (
        <div className="feedback-section">
          <h2>AI Feedback Reports</h2>
          {feedback.map((report) => (
            <div key={report.athleteId} className="feedback-card">
              <h3>{report.athleteName}</h3>
              <p>Overall Score: {report.overallScore}</p>
              <div className="strengths">
                <h4>Strengths:</h4>
                <ul>
                  {report.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
              <div className="recommendations">
                <h4>Recommendations:</h4>
                <ul>
                  {report.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
              <p className="motivational">{report.motivationalMessage}</p>
            </div>
          ))}
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
        case 409:
          return 'Email or phone already exists.';
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
      case 409:
        return 'Email or phone already exists.';
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
- **Data Validation**: Validate data on both client and server side
- **Sport-Specific Logic**: Handle different sports and their specific test models
- **Real-time Updates**: Consider WebSocket connections for real-time leaderboard updates

## Supported Sports and Test Models

When integrating sport-specific tests, use the appropriate test model based on the athlete's sport:

- **Swimming**: `SwimmingTest` with stroke rate, efficiency, technique metrics
- **Archery**: `ArcheryTest` with accuracy, consistency, focus metrics
- **Boxing**: `BoxingTest` with punch power, speed, reaction time metrics
- **Athletics**: `AthleticsTest` with track and field specific metrics
- **Cycling**: `CyclingTest` with power, endurance, efficiency metrics
- **Fencing**: `FencingTest` with reaction time, precision metrics
- **Hockey**: `HockeyTest` with team coordination, speed metrics
- **Judo**: `JudoTest` with strength, technique, balance metrics
- **Rowing**: `RowingTest` with power, endurance, technique metrics
- **Shooting**: `ShootingTest` with precision, stability, focus metrics
- **Table Tennis**: `TableTennisTest` with reaction time, coordination metrics
- **Weightlifting**: `WeightliftingTest` with strength, power, technique metrics
- **Wrestling**: `WrestlingTest` with strength, endurance, technique metrics