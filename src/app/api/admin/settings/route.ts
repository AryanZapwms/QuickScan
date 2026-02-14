import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/database';
import mongoose from 'mongoose';

// Settings Schema
const SettingsSchema = new mongoose.Schema({
  general: {
    platformName: String,
    adminEmail: String,
    supportPhone: String,
    logo: String,
  },
  booking: {
    autoConfirm: Boolean,
    emailNotifications: Boolean,
    leadTime: Number,
    cancellationPolicy: String,
  },
  payment: {
    enableUPI: Boolean,
    enableCard: Boolean,
    enableNetBanking: Boolean,
    enableWallet: Boolean,
    enableCash: Boolean,
  },
  notifications: {
    emailEnabled: Boolean,
    smsEnabled: Boolean,
  },
  updatedAt: { type: Date, default: Date.now },
});

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    let settings = await Settings.findOne();
    
    // Create default settings if none exist
    if (!settings) {
      settings = await Settings.create({
        general: {
          platformName: 'QuickScan',
          adminEmail: 'admin@quickscan.com',
          supportPhone: '+91 1800 123 4567',
        },
        booking: {
          autoConfirm: true,
          emailNotifications: true,
          leadTime: 24,
          cancellationPolicy: '24 hours before appointment',
        },
        payment: {
          enableUPI: true,
          enableCard: true,
          enableNetBanking: true,
          enableWallet: true,
          enableCash: true,
        },
        notifications: {
          emailEnabled: true,
          smsEnabled: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });

  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const data = await request.json();

    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create(data);
    } else {
      settings = await Settings.findOneAndUpdate(
        {},
        { ...data, updatedAt: new Date() },
        { new: true }
      );
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });

  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
