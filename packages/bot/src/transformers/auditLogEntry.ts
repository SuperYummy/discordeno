import type { AuditLogEvents, DiscordAuditLogEntry, OverwriteTypes } from '@discordeno/types'
import { iconHashToBigInt, type Bot } from '../index.js'

export function transformAuditLogEntry(bot: Bot, payload: DiscordAuditLogEntry): AuditLogEntry {
  const auditLogEntry = {
    id: bot.transformers.snowflake(payload.id),
    changes: payload.changes?.map((change) => {
      switch (change.key) {
        case '$add':
        case '$remove':
          return {
            key: change.key,
            new: change.new_value?.map((val) => ({
              id: val.id ? bot.transformers.snowflake(val.id) : undefined,
              name: val.name,
            })),
            old: change.old_value?.map((val) => ({
              id: val?.id ? bot.transformers.snowflake(val.id) : undefined,
              name: val?.name,
            })),
          }
        case 'rules_channel_id':
        case 'public_updates_channel_id':
        case 'owner_id':
        case 'widget_channel_id':
        case 'system_channel_id':
        case 'application_id':
        case 'permissions':
        case 'allow':
        case 'deny':
        case 'channel_id':
        case 'inviter_id':
        case 'id':
          return {
            key: change.key,
            old: change.old_value ? bot.transformers.snowflake(change.old_value) : undefined,
            new: change.new_value ? bot.transformers.snowflake(change.new_value) : undefined,
          }
        case 'discovery_splash_hash':
        case 'banner_hash':
        case 'icon_hash':
        case 'image_hash':
        case 'splash_hash':
        case 'avatar_hash':
          return {
            key: change.key,
            old: change.old_value ? iconHashToBigInt(change.old_value) : undefined,
            new: change.new_value ? iconHashToBigInt(change.new_value) : undefined,
          }
        case 'name':
        case 'description':
        case 'preferred_locale':
        case 'region':
        case 'afk_channel_id':
        case 'vanity_url_code':
        case 'topic':
        case 'code':
        case 'nick':
        case 'location':
          return {
            key: change.key,
            old: change.old_value,
            new: change.new_value,
          }
        case 'afk_timeout':
        case 'mfa_level':
        case 'verification_level':
        case 'explicit_content_filter':
        case 'default_message_notifications':
        case 'prune_delete_days':
        case 'position':
        case 'bitrate':
        case 'rate_limit_per_user':
        case 'color':
        case 'max_uses':
        case 'uses':
        case 'max_age':
        case 'expire_behavior':
        case 'expire_grace_period':
        case 'user_limit':
        case 'privacy_level':
        case 'entity_type':
        case 'status':
          return {
            key: change.key,
            old: change.old_value ? Number(change.old_value) : undefined,
            new: change.new_value ? Number(change.new_value) : undefined,
          }
        case 'widget_enabled':
        case 'nsfw':
        case 'hoist':
        case 'mentionable':
        case 'temporary':
        case 'deaf':
        case 'mute':
        case 'enable_emoticons':
          return {
            key: change.key,
            old: change.old_value ?? false,
            new: change.new_value ?? false,
          }
        case 'permission_overwrites':
          return {
            key: change.key,
            old: change.old_value,
            new: change.new_value,
          }
        default:
          return {
            key: change.key,
            old: change.old_value,
            new: change.new_value,
          }
      }
    }),
    userId: payload.user_id ? bot.transformers.snowflake(payload.user_id) : undefined,
    targetId: payload.target_id ? bot.transformers.snowflake(payload.target_id) : undefined,
    actionType: payload.action_type,
    options: payload.options
      ? {
          deleteMemberDays: payload.options.delete_member_days ? Number(payload.options.delete_member_days) : 0,
          membersRemoved: payload.options.members_removed ? Number(payload.options.members_removed) : 0,
          channelId: payload.options.channel_id ? bot.transformers.snowflake(payload.options.channel_id) : undefined,
          messageId: payload.options.message_id ? bot.transformers.snowflake(payload.options.message_id) : undefined,
          count: payload.options.count ? Number(payload.options.count) : 0,
          id: payload.options.id ? bot.transformers.snowflake(payload.options.id) : undefined,
          type: Number(payload.options.type),
          roleName: payload.options.role_name,
          autoModerationRuleName: payload.options.auto_moderation_rule_name,
          autoModerationRuleTriggerType: payload.options.auto_moderation_rule_trigger_type,
          integrationType: payload.options.integration_type,
        }
      : undefined,
    reason: payload.reason,
  } as AuditLogEntry

  return bot.transformers.customizers.auditLogEntry(bot, payload, auditLogEntry)
}

export interface AuditLogEntry {
  id: bigint
  userId?: bigint
  reason?: string
  changes?: Array<{
    new?:
      | string
      | number
      | bigint
      | boolean
      | Array<{
          allow?: string
          deny?: string
          id: string
          type: OverwriteTypes
        }>
      | Array<{
          id?: bigint
          name?: string
        }>
    old?:
      | string
      | number
      | bigint
      | boolean
      | Array<{
          allow?: string
          deny?: string
          id: string
          type: OverwriteTypes
        }>
      | Array<{
          id?: bigint
          name?: string
        }>
    key:
      | 'id'
      | 'name'
      | 'description'
      | 'type'
      | 'permissions'
      | 'locked'
      | 'invitable'
      | 'nsfw'
      | 'archived'
      | 'position'
      | 'topic'
      | 'bitrate'
      | 'default_auto_archive_duration'
      | 'auto_archive_duration'
      | 'allow'
      | 'deny'
      | 'channel_id'
      | 'deaf'
      | 'mute'
      | 'status'
      | 'nick'
      | 'communication_disabled_until'
      | 'color'
      | 'permission_overwrites'
      | 'user_limit'
      | 'rate_limit_per_user'
      | 'owner_id'
      | 'application_id'
      | 'hoist'
      | 'mentionable'
      | 'location'
      | 'verification_level'
      | 'default_message_notifications'
      | 'explicit_content_filter'
      | 'preferred_locale'
      | 'afk_timeout'
      | 'afk_channel_id'
      | 'system_channel_id'
      | 'widget_enabled'
      | 'mfa_level'
      | 'vanity_url_code'
      | 'icon_hash'
      | 'widget_channel_id'
      | 'rules_channel_id'
      | 'public_updates_channel_id'
      | 'code'
      | 'region'
      | 'privacy_level'
      | 'entity_type'
      | 'enable_emoticons'
      | 'expire_behavior'
      | 'expire_grace_period'
      | 'uses'
      | 'max_uses'
      | 'max_age'
      | 'temporary'
      | 'discovery_splash_hash'
      | 'banner_hash'
      | 'image_hash'
      | 'splash_hash'
      | 'inviter_id'
      | 'avatar_hash'
      | 'command_id'
      | 'prune_delete_days'
      | '$add'
      | '$remove'
  }>
  targetId?: bigint
  actionType: AuditLogEvents
  options?: {
    id?: bigint
    channelId?: bigint
    messageId?: bigint
    type: number
    count: number
    deleteMemberDays: number
    membersRemoved: number
    roleName: string
    autoModerationRuleName: string
    autoModerationRuleTriggerType: string
    integrationType: string
  }
}
