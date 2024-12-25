import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const UserProfile = () => {
    const { user, updateProfile, deleteAccount } = useAuth();
    const navigate = useNavigate();

    console.log(user.userId);
    
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    console.log(user);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phoneno: user?.phoneno || '',
        gender: user?.gender || '',
        age: user?.age || '',
        address: user?.address || ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const result = await updateProfile(formData);
        if (result.success) {
            setIsEditing(false);
        }
    };

    const handleDeleteAccount = async () => {
        const result = await deleteAccount();
        // if (result.success) {
        //     navigate('/');
        // }
        setShowDeleteDialog(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Profile Information</h2>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => setShowDeleteDialog(true)}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                    </Button>
                </div>
            </div>

            {isEditing ? (
                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="phoneno">Phone Number</Label>
                            <Input
                                id="phoneno"
                                name="phoneno"
                                value={formData.phoneno}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="gender">Gender</Label>
                            <Input
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <Button onClick={handleUpdateProfile}>Save Changes</Button>
                </form>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Name</Label>
                        <p className="mt-1">{user?.name}</p>
                    </div>
                    <div>
                        <Label>Email</Label>
                        <p className="mt-1">{user?.email}</p>
                    </div>
                    <div>
                        <Label>Phone Number</Label>
                        <p className="mt-1">{user?.phoneno || 'Not provided'}</p>
                    </div>
                    <div>
                        <Label>Gender</Label>
                        <p className="mt-1">{user?.gender || 'Not provided'}</p>
                    </div>
                    <div>
                        <Label>Age</Label>
                        <p className="mt-1">{user?.age || 'Not provided'}</p>
                    </div>
                    <div>
                        <Label>Address</Label>
                        <p className="mt-1">{user?.address || 'Not provided'}</p>
                    </div>
                </div>
            )}

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Account</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete your account? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                            Delete Account
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserProfile;