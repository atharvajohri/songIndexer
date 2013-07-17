package com.si.auth

import com.si.core.Track

class SecUser {

	transient springSecurityService

	String username
	String password
	String fid
	Date dateCreated
	String postLink
	boolean enabled = false
	boolean accountExpired
	boolean accountLocked
	boolean passwordExpired
	InviteCode inviteCode
	
	static hasMany = [uploadedTracks:Track]
	
	static constraints = {
		username blank: false, unique: true
		password blank: false
		fid nullable:true
		postLink nullable:true
		inviteKey nullable:true
	}

	static mapping = {
		password column: '`password`'
	}

	Set<SecRole> getAuthorities() {
		SecUserSecRole.findAllBySecUser(this).collect { it.secRole } as Set
	}

	def beforeInsert() {
		encodePassword()
	}

	def beforeUpdate() {
		if (isDirty('password')) {
			encodePassword()
		}
	}

	protected void encodePassword() {
		password = springSecurityService.encodePassword(password)
	}
}
